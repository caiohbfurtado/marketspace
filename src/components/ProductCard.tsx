import { Box, HStack, Image, Text, VStack } from 'native-base'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { Badge } from './Badge'
import { UserPhoto } from './UserPhoto'

type Props = TouchableOpacityProps

export function ProductCard({ ...rest }: Props) {
  return (
    <TouchableOpacity style={{ width: 160, marginBottom: 24 }} {...rest}>
      <Image
        source={{
          uri: 'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/brogan/media/uploads/produtos/foto/skcjyjvc/sapato-masculino-derby-alava-conhaque-1.webp',
        }}
        w={40}
        h={24}
        alt="Imagem do usuário"
        borderRadius={6}
        resizeMode="cover"
      />

      <Box position="absolute" w="full" p={1}>
        <HStack justifyContent="space-between">
          <UserPhoto
            borderWidth={1}
            borderColor="gray.700"
            size={6}
            alt="Foto do usuário"
          />
          <Badge title="new" />
        </HStack>
      </Box>

      <VStack ml={1} mt={1}>
        <Text fontSize="sm" color="gray.200" fontFamily="body">
          Tênis vermelho
        </Text>

        <HStack>
          <Text color="gray.200" fontSize="xs" fontFamily="heading">
            R${' '}
            <Text color="gray.200" fontSize="md" fontFamily="heading">
              59,90
            </Text>
          </Text>
        </HStack>
      </VStack>
    </TouchableOpacity>
  )
}
