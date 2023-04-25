import { FormControl, HStack, Text, useTheme } from 'native-base'
import { useState } from 'react'
import { MaskedTextInput, MaskedTextInputProps } from 'react-native-mask-text'

type Props = MaskedTextInputProps & {
  errorMessage?: string | null
  preffix?: string
}

export function InputMask({ errorMessage = null, preffix, ...rest }: Props) {
  const { colors, fonts, fontSizes, radii } = useTheme()
  const invalid = !!errorMessage
  const [isFocused, setIsFocused] = useState(false)

  function handleOnFocus() {
    setIsFocused(true)
  }

  function handleOnBlur() {
    setIsFocused(false)
  }

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <HStack alignItems="center">
        <MaskedTextInput
          style={[
            {
              width: '100%',
              height: 48,
              backgroundColor: colors.gray[700],
              borderRadius: radii.md,
              paddingHorizontal: 16,
              paddingLeft: preffix ? 44 : 0,
              fontFamily: fonts.body,
              fontSize: fontSizes.md,
              color: colors.gray[300],
            },
            isFocused && { borderWidth: 1, borderColor: colors.gray[300] },
            errorMessage && { borderWidth: 1, borderColor: colors.error[500] },
          ]}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          {...rest}
        />

        {preffix && (
          <Text position="absolute" left={4}>
            {preffix}
          </Text>
        )}
      </HStack>

      <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
