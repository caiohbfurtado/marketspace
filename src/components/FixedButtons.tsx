import { HStack } from 'native-base'
import { Button, ButtonProps } from './Button'

type Props = {
  leftButton: ButtonProps
  rightButton: ButtonProps
}

export function FixedButtons({ leftButton, rightButton }: Props) {
  return (
    <HStack
      bg="white"
      px={6}
      h={90}
      position="fixed"
      alignItems="center"
      bottom={0}
    >
      <Button mr={3} {...leftButton} />
      <Button {...rightButton} />
    </HStack>
  )
}
