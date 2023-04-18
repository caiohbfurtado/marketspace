import { Box, IBoxProps, Text } from 'native-base'

type Props = IBoxProps & {
  title: 'new' | 'used'
}

export function Badge({ title, ...rest }: Props) {
  return (
    <Box
      bg={title === 'new' ? 'blue.500' : 'gray.200'}
      py={0.5}
      px={2}
      borderRadius="full"
      alignItems="center"
      justifyContent="center"
      alignSelf="flex-start"
      {...rest}
    >
      <Text
        color="white"
        textTransform="uppercase"
        fontFamily="heading"
        fontSize="2xs"
      >
        {title === 'new' ? 'novo' : 'usado'}
      </Text>
    </Box>
  )
}
