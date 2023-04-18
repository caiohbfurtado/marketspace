import { IPressableProps, Pressable, Text, useTheme } from 'native-base'
import { XCircle } from 'phosphor-react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

type Props = IPressableProps & {
  title: string
  active: boolean
}

export function TagRemovable({ title, active, ...rest }: Props) {
  const { colors } = useTheme()
  return (
    <Pressable
      backgroundColor={active ? 'blue.300' : 'gray.500'}
      px={4}
      py={1.5}
      borderRadius="full"
      flexDirection="row"
      alignItems="center"
      mr={2}
      {...(active && { pr: 1.5 })}
      {...rest}
    >
      <Text
        color={active ? 'white' : 'gray.300'}
        fontSize="sm"
        textTransform="uppercase"
        fontFamily="heading"
        mr={active ? 1.5 : 0}
      >
        {title}
      </Text>
      {active && (
        <TouchableOpacity>
          <XCircle color={colors.white} weight="fill" size={18} />
        </TouchableOpacity>
      )}
    </Pressable>
  )
}
