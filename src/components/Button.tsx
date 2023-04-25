import {
  Button as NativeBaseButton,
  IButtonProps,
  StyledProps,
  Text,
} from 'native-base'
import { RefObject } from 'react'

export type ButtonProps = IButtonProps & {
  title: string
  variant?: 'dark' | 'light' | 'default'
  buttonRef?: RefObject<null>
}

export function Button({
  title,
  variant = 'default',
  width = 'full',
  buttonRef,
  ...rest
}: ButtonProps) {
  const getButtonProps = (pressed = false): StyledProps => {
    if (variant === 'light') {
      return {
        bg: pressed ? 'gray.400' : 'gray.500',
      }
    }

    if (variant === 'dark') {
      return {
        bg: pressed ? 'black' : 'gray.100',
      }
    }

    return {
      bg: pressed ? 'blue.500' : 'blue.300',
    }
  }

  return (
    <NativeBaseButton
      ref={buttonRef}
      w={width}
      h={11}
      alignItems="center"
      justifyContent="center"
      borderRadius={6}
      flexShrink={1}
      {...getButtonProps()}
      _pressed={{ ...getButtonProps(true) }}
      {...rest}
    >
      <Text
        fontSize="sm"
        fontFamily="heading"
        textAlign="center"
        color={variant === 'light' ? 'gray.200' : 'gray.700'}
      >
        {title}
      </Text>
    </NativeBaseButton>
  )
}
