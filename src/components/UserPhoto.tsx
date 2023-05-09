import { Box, IImageProps, Image } from 'native-base'

import UserAvatarDefault from '@assets/user-avatar.png'
import { useState } from 'react'
import { Skeleton } from './Skeleton'

type Props = IImageProps & {
  size: number
  photo?: string
}

export function UserPhoto({ size, photo, alt, ...rest }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const image = photo ? { uri: photo } : UserAvatarDefault

  return (
    <Box w={size} h={size}>
      {isLoading && (
        <Skeleton borderRadius="full" position="absolute" w={size} h={size} />
      )}
      <Image
        w={size}
        h={size}
        alt={alt}
        borderRadius="full"
        source={image}
        onLoadStart={() => {
          setIsLoading(true)
        }}
        onLoadEnd={() => {
          setIsLoading(false)
        }}
        {...rest}
      />
    </Box>
  )
}
