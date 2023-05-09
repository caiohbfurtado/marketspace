/* eslint-disable camelcase */
import { useNavigation, useRoute } from '@react-navigation/native'
import {
  Heading,
  HStack,
  ScrollView,
  Text,
  useTheme,
  VStack,
  useToast,
} from 'native-base'
import { ArrowLeft, Tag } from 'phosphor-react-native'
import { Badge } from '../components/Badge'
import { FixedButtons } from '../components/FixedButtons'
import { UserPhoto } from '../components/UserPhoto'
import { AppNavigatorRoutesProps } from '../routes/app.routes'
import * as ImagePicker from 'expo-image-picker'
import { useAuth } from '../hooks/useAuth'
import { useMemo, useState } from 'react'
import { priceFormat } from '../utils/priceFormat'
import { api } from '../services/api'
import { AppError } from '../utils/AppError'
import { PaymentMethodsKey, ProductDTO } from '../dtos/ProductDTO'
import { PaymentMethodsList } from '../components/PaymentMethodsList'
import { Carousel } from '../components/Carousel'
import { PhotoInfo } from './CreateAnnouncement'

type RouteParams = {
  productInfo: {
    id?: string
    images: ImagePicker.ImagePickerAsset[]
    name: string
    description: string
    payment_methods: PaymentMethodsKey[]
    accept_trade: boolean
    is_new: boolean
    price: number
  }
  reset: () => void
  removedImages: string[]
  isNewProduct: boolean
  imagesUri: PhotoInfo[]
}

export function PreviewAnnouncement() {
  const route = useRoute()
  const {
    productInfo,
    reset,
    removedImages,
    isNewProduct,
    imagesUri: imagesUriProp,
  } = route.params as RouteParams
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const { colors } = useTheme()
  const {
    accept_trade,
    description,
    images,
    is_new,
    name,
    payment_methods,
    price,
  } = productInfo
  const { user } = useAuth()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  function handleGoBack() {
    navigation.goBack()
  }

  const imagesUri = imagesUriProp.map((image) =>
    image.isLocal ? image.path : `${api.defaults.baseURL}/images/${image.path}`,
  )

  const priceFormatted = useMemo(() => priceFormat(price), [price])

  async function handleSubmit() {
    try {
      setIsLoading(true)
      const newProduct = {
        accept_trade,
        description,
        is_new,
        name,
        payment_methods,
        price,
      }

      if (isNewProduct) {
        const response = await api.post<ProductDTO>('/products', newProduct)
        const productId = response.data.id

        const dataForm = new FormData()

        images.forEach((photo, index) => {
          const fileExtension = photo.uri.split('.').pop()
          const photoFile = {
            name: `product-${productId}-${index}.${fileExtension}`
              .toLowerCase()
              .replace(' ', '-'),
            uri: photo.uri,
            type: `${photo.type}/${fileExtension}`,
          } as any

          dataForm.append('images', photoFile)
        })

        dataForm.append('product_id', productId)
        await api.post('/products/images', dataForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        toast.show({
          title: 'Produto cadastrado com sucesso!',
          placement: 'top',
          bgColor: 'green.500',
          _title: {
            textAlign: 'center',
          },
        })
        reset()
      } else {
        if (removedImages.length > 0) {
          const productImagesIds = { productImagesIds: removedImages }
          await api.delete('/products/images', { data: productImagesIds })
        }
        const productId = productInfo.id!

        await api.put<ProductDTO>(`/products/${productId}`, newProduct)

        const dataForm = new FormData()

        if (images.length > 0) {
          images.forEach((photo, index) => {
            const fileExtension = photo.uri.split('.').pop()
            const photoFile = {
              name: `product-${productId}-${index}.${fileExtension}`
                .toLowerCase()
                .replace(' ', '-'),
              uri: photo.uri,
              type: `${photo.type}/${fileExtension}`,
            } as any

            dataForm.append('images', photoFile)
          })

          dataForm.append('product_id', productId)
          await api.post('/products/images', dataForm, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        }

        toast.show({
          title: 'Produto editado com sucesso!',
          placement: 'top',
          bgColor: 'green.500',
          _title: {
            textAlign: 'center',
          },
        })
        reset()
      }

      navigation.navigate('MyAnnouncements')
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível criar o anúncio. Tente novamente mais tarde'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
        _title: {
          textAlign: 'center',
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1}>
      <VStack
        position="fixed"
        h={32}
        bg="blue.300"
        alignItems="center"
        justifyContent="flex-end"
        pb={4}
      >
        <Heading color="gray.700" fontFamily="heading" fontSize="md" mb={0.5}>
          Pré visualização do anúncio
        </Heading>
        <Text color="gray.700" fontFamily="body" fontSize="md">
          É assim que seu produto vai aparecer!
        </Text>
      </VStack>

      <ScrollView showsVerticalScrollIndicator={false} flex={1}>
        <VStack pb={6}>
          <Carousel imagesUri={imagesUri} productName={name} />

          <VStack px={6} py={5}>
            <HStack alignItems="center">
              <UserPhoto
                size={6}
                borderWidth={2}
                borderColor="blue.300"
                alt="Imagem do usuário"
                photo={`${api.defaults.baseURL}/images/${user.avatar}`}
              />
              <Text fontFamily="body" fontSize="sm" color="gray.100" ml={2}>
                {user.name}
              </Text>
            </HStack>

            <VStack my={6}>
              <Badge title={is_new ? 'new' : 'used'} />

              <HStack alignItems="center" justifyContent="space-between" my={2}>
                <Heading
                  fontFamily="heading"
                  fontSize="xl"
                  color="gray.100"
                  mr={1}
                  flexShrink={1}
                >
                  {name}
                </Heading>

                <HStack alignItems="center">
                  <Text
                    fontFamily="heading"
                    fontSize="sm"
                    color="blue.300"
                    mr={1}
                    mt={0.5}
                  >
                    R$
                  </Text>
                  <Text fontFamily="heading" fontSize="xl" color="blue.300">
                    {priceFormatted}
                  </Text>
                </HStack>
              </HStack>

              <Text fontFamily="body" color="gray.200" fontSize="sm">
                {description}
              </Text>
            </VStack>

            <HStack alignItems="center" mb={4}>
              <Heading color="gray.200" fontFamily="heading" fontSize="sm">
                Aceita troca?
              </Heading>
              <Text color="gray.200" fontFamily="body" fontSize="sm" ml={2}>
                {accept_trade ? 'Sim' : 'Não'}
              </Text>
            </HStack>

            <VStack>
              <Heading color="gray.200" fontFamily="heading" fontSize="sm">
                Meios de pagamento:
              </Heading>

              <VStack my={2}>
                {payment_methods.map((method) => (
                  <PaymentMethodsList key={method} method={method} />
                ))}
              </VStack>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>

      <FixedButtons
        leftButton={{
          title: 'Voltar e editar',
          variant: 'light',
          leftIcon: <ArrowLeft size={16} color={colors.gray[200]} />,
          onPress: handleGoBack,
        }}
        rightButton={{
          title: 'Publicar',
          leftIcon: <Tag size={16} color={colors.gray[600]} />,
          onPress: handleSubmit,
          isLoading,
        }}
      />
    </VStack>
  )
}
