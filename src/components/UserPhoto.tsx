import { IImageProps, Image } from 'native-base'

import UserAvatarDefault from '@assets/user-avatar.png'

type Props = IImageProps & {
  size: number
  photo?: string
}

export function UserPhoto({ size, photo, alt, ...rest }: Props) {
  const image = photo ? { uri: photo } : UserAvatarDefault

  return (
    <Image
      w={size}
      h={size}
      alt={alt}
      borderRadius="full"
      source={image}
      {...rest}
    />
  )
}
