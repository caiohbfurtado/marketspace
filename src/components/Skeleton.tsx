import { ISkeletonProps, Skeleton as SkeletonNativeBase } from 'native-base'

export function Skeleton({ ...rest }: ISkeletonProps) {
  return <SkeletonNativeBase startColor="gray.300" {...rest} />
}
