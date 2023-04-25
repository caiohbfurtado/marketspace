import { Box, Center, FlatList, HStack, Image, Text } from 'native-base'
import { useRef, useState } from 'react'
import { ViewToken, useWindowDimensions } from 'react-native'

type Props = {
  imagesUri: string[]
  productName: string
  deactivate?: boolean
}

export function Carousel({
  imagesUri,
  productName,
  deactivate = false,
}: Props) {
  const { width } = useWindowDimensions()
  const [inViewPort, setInViewPort] = useState(0)

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    waitForInteraction: true,
    minimumViewTime: 5,
  })

  const onViewableItemsChanged = useRef(
    ({ changed }: { changed: ViewToken[] }) => {
      if (changed && changed.length > 0) {
        setInViewPort(changed[0]?.index ?? 1)
      }
    },
  )

  return (
    <Center w="full">
      <FlatList
        data={imagesUri}
        nestedScrollEnabled
        horizontal
        renderItem={({ item, index }) => (
          <Image
            source={{ uri: item }}
            w={width}
            h={280}
            alt={`Imagem ${index} do produto ${productName}`}
          />
        )}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
      />

      <HStack position="absolute" bottom={0.5} mx={0.5}>
        {imagesUri.map((_, index) => (
          <Box
            key={String(index)}
            flex={1}
            h={1}
            mr={index === imagesUri.length - 1 ? 0 : 1}
            backgroundColor="gray.700"
            borderRadius="full"
            opacity={index !== inViewPort ? 0.5 : 0.75}
          />
        ))}
      </HStack>

      {deactivate && (
        <Center
          position="absolute"
          backgroundColor="gray.100"
          w={width}
          height={280}
          flex={1}
          opacity={0.6}
        >
          <Text color="gray.700" fontFamily="heading" fontSize="md">
            ANÚNCIO DESATIVADO
          </Text>
        </Center>
      )}
    </Center>
  )
}
