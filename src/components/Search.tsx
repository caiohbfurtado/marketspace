import { Divider, HStack, IInputProps, theme, useTheme } from 'native-base'
import { TouchableOpacity } from 'react-native'
import { Input } from './Input'
import { MagnifyingGlass, Sliders } from 'phosphor-react-native'

type Props = IInputProps & {
  onSearch?: () => void
  onFilter?: () => void
}

export function Search({ onSearch, onFilter, ...rest }: Props) {
  const { colors } = useTheme()

  return (
    <HStack alignItems="center">
      <Input placeholder="Buscar anúncio" marginBottom="0" {...rest} />

      <HStack position="absolute" right={4}>
        <TouchableOpacity onPress={onSearch}>
          <MagnifyingGlass color={colors.gray[200]} size={20} />
        </TouchableOpacity>
        <Divider orientation="vertical" bg="gray.400" mx={3} />
        <TouchableOpacity style={{ zIndex: 10 }} onPress={onFilter}>
          <Sliders size={20} color={colors.gray[200]} />
        </TouchableOpacity>
      </HStack>
    </HStack>
  )
}
