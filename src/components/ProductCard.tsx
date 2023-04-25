import { Box, Center, HStack, Image, Text, VStack } from 'native-base'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { Badge } from './Badge'
import { UserPhoto } from './UserPhoto'
import { ProductDTO } from '../dtos/ProductDTO'
import { useMemo } from 'react'
import { priceFormat } from '../utils/priceFormat'

type Props = TouchableOpacityProps & {
  product: ProductDTO
  isUser?: boolean
}

export function ProductCard({ product, isUser = false, ...rest }: Props) {
  const priceFormatted = useMemo(() => {
    return priceFormat(product?.price)
  }, [product?.price])

  return (
    <TouchableOpacity style={{ width: 160, marginBottom: 24 }} {...rest}>
      <Image
        source={{
          uri: `http://127.50.100.1:3333/images/${product.product_images[0].path}`,
        }}
        w={40}
        h={24}
        alt="Imagem do produto"
        borderRadius={6}
        resizeMode="cover"
      />

      <Box position="absolute" w="full" p={1}>
        <HStack justifyContent={isUser ? 'flex-end' : 'space-between'}>
          {!isUser && (
            <UserPhoto
              borderWidth={1}
              borderColor="gray.700"
              size={6}
              alt="Foto do usuário"
              photo={`http://127.0.0.1:3333/images/${product.user.avatar}`}
            />
          )}
          <Badge title={product?.is_new ? 'new' : 'used'} />
        </HStack>
      </Box>

      <VStack ml={1} mt={1}>
        <Text
          fontSize="sm"
          color="gray.200"
          fontFamily="body"
          numberOfLines={1}
        >
          {product?.name}
        </Text>

        <HStack>
          <Text color="gray.200" fontSize="xs" fontFamily="heading">
            R${' '}
            <Text color="gray.200" fontSize="md" fontFamily="heading">
              {priceFormatted}
            </Text>
          </Text>
        </HStack>
      </VStack>

      {!product.is_active && isUser && (
        <Center
          position="absolute"
          backgroundColor="gray.100"
          w={40}
          h={24}
          opacity={0.6}
          borderRadius={6}
        >
          <Text color="gray.700" fontFamily="heading" fontSize="xs">
            ANÚNCIO DESATIVADO
          </Text>
        </Center>
      )}
    </TouchableOpacity>
  )
}
