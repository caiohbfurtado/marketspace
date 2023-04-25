import { Box, HStack, Image, Text, VStack } from 'native-base'
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
          uri: 'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/brogan/media/uploads/produtos/foto/skcjyjvc/sapato-masculino-derby-alava-conhaque-1.webp',
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
        <Text fontSize="sm" color="gray.200" fontFamily="body">
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
    </TouchableOpacity>
  )
}
