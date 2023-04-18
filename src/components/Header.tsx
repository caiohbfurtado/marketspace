import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Heading, HStack, useTheme } from 'native-base'
import { ArrowLeft, Icon } from 'phosphor-react-native'

type Props = {
  title?: string
  hasBackButton?: boolean
  rightIcon?: Icon
  onPressRightIcon?: () => void
}

export function Header({
  title,
  rightIcon,
  onPressRightIcon,
  hasBackButton = true,
}: Props) {
  const { colors } = useTheme()
  const { goBack } = useNavigation()

  const Icon = rightIcon

  function handleGoBack() {
    goBack()
  }

  return (
    <HStack alignItems="center" justifyContent="center" w="full">
      {hasBackButton && (
        <TouchableOpacity
          style={{ position: 'absolute', left: 0 }}
          onPress={handleGoBack}
        >
          <ArrowLeft size={24} color={colors.gray[100]} />
        </TouchableOpacity>
      )}
      <Heading color="gray.100" fontFamily="heading" fontSize="xl">
        {title}
      </Heading>
      {Icon && (
        <TouchableOpacity
          style={{ position: 'absolute', right: 0 }}
          onPress={onPressRightIcon}
        >
          <Icon size={24} color={colors.gray[100]} />
        </TouchableOpacity>
      )}
    </HStack>
  )
}
