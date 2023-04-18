import {
  FormControl,
  HStack,
  IInputProps,
  Input as NativeBaseInput,
  Text,
  useTheme,
} from 'native-base'
import { Eye, EyeSlash } from 'phosphor-react-native'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'

type Props = IInputProps & {
  errorMessage?: string | null
  preffix?: string
}

export function Input({
  errorMessage = null,
  mb,
  marginBottom,
  isInvalid,
  secureTextEntry,
  preffix,
  ...rest
}: Props) {
  const { colors } = useTheme()
  const [passwordIsVisible, setPasswordIsVisible] = useState(false)
  const invalid = !!errorMessage || isInvalid

  function handleUpdateVisible() {
    setPasswordIsVisible((oldValue) => !oldValue)
  }

  const EyeIcon = passwordIsVisible ? EyeSlash : Eye

  return (
    <FormControl isInvalid={invalid} mb={(mb || marginBottom) ?? 4}>
      <HStack alignItems="center">
        <NativeBaseInput
          w="full"
          h={12}
          px={4}
          bg="gray.700"
          color="gray.300"
          fontSize="md"
          fontFamily="body"
          borderWidth="0"
          _focus={{
            bg: 'gray.700',
            borderWidth: 1,
            borderColor: 'gray.300',
          }}
          _invalid={{
            borderWidth: 1,
            borderColor: 'error.500',
          }}
          {...(secureTextEntry &&
            !passwordIsVisible && { secureTextEntry: true })}
          {...(preffix && { pl: 44 })}
          {...rest}
        />
        {preffix && (
          <Text position="absolute" left={4}>
            {preffix}
          </Text>
        )}
        {secureTextEntry && (
          <TouchableOpacity
            style={{ position: 'absolute', right: 16 }}
            onPress={handleUpdateVisible}
          >
            <EyeIcon size={20} color={colors.gray[300]} />
          </TouchableOpacity>
        )}
      </HStack>

      <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
