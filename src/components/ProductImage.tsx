import { Box, IBoxProps, Image, useTheme } from 'native-base'
import { X } from 'phosphor-react-native'
import { TouchableOpacity } from 'react-native'

type Props = IBoxProps & {
  photo: string
  onRemoveImage: () => void
}

export function ProductImage({ photo, onRemoveImage, ...rest }: Props) {
  const { colors } = useTheme()

  return (
    <Box w={100} h={100} bg="gray.500" borderRadius={6} {...rest}>
      <Image
        w={100}
        h={100}
        borderRadius={6}
        source={{ uri: photo }}
        alt="Imagem do produto"
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 4,
          top: 4,
          backgroundColor: colors.gray[200],
          borderRadius: 8,
          height: 16,
          width: 16,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={onRemoveImage}
        hitSlop={{ bottom: 10, top: 10, left: 10, right: 10 }}
      >
        <X size={12} color={colors.gray[700]} />
      </TouchableOpacity>
    </Box>
  )
}
