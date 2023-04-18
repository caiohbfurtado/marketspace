import { Center, useTheme } from 'native-base'
import { Plus } from 'phosphor-react-native'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

export function AddImageButton({ style, ...rest }: TouchableOpacityProps) {
  const { colors } = useTheme()

  return (
    <TouchableOpacity style={[style, { alignSelf: 'flex-start' }]} {...rest}>
      <Center w={100} h={100} bg="gray.500" borderRadius={6}>
        <Plus size={24} color={colors.gray[400]} />
      </Center>
    </TouchableOpacity>
  )
}
