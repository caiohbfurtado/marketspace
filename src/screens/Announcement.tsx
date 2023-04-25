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
import { WhatsappLogo } from 'phosphor-react-native'
import { Badge } from '../components/Badge'
import { UserPhoto } from '../components/UserPhoto'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { priceFormat } from '../utils/priceFormat'
import { api } from '../services/api'
import { AppError } from '../utils/AppError'
import { ProductDTO } from '../dtos/ProductDTO'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Loading } from '../components/Loading'
import { Carousel } from '../components/Carousel'
import { PaymentMethodsList } from '../components/PaymentMethodsList'
import { AppNavigatorRoutesProps } from '../routes/app.routes'

type RouteParams = {
  productId: string
}

export function Announcement() {
  const route = useRoute()
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const { productId } = route.params as RouteParams
  const { colors } = useTheme()
  const toast = useToast()
  const [isLoadingInfo, setIsLoadingInfo] = useState(true)
  const [productInfo, setProductInfo] = useState<ProductDTO>({} as ProductDTO)
  const [imagesUri, setImagesUri] = useState<string[]>([])

  const getProductInfo = useCallback(async () => {
    try {
      setIsLoadingInfo(true)
      const response = await api.get<ProductDTO>(`/products/${productId}`)
      setProductInfo(response.data)
      setImagesUri(
        response.data.product_images.map(
          ({ path }) => `http://127.0.0.1:3333/images/${path}`,
        ),
      )
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível buscar os dados do produto. Tente novamente.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
        _text: {
          textAlign: 'center',
        },
      })
      navigate('Home')
    } finally {
      setIsLoadingInfo(false)
    }
  }, [navigate, productId, toast])

  useEffect(() => {
    getProductInfo()
  }, [getProductInfo])

  const priceFormatted = useMemo(
    () => priceFormat(productInfo.price),
    [productInfo.price],
  )

  if (isLoadingInfo) return <Loading />

  return (
    <VStack flex={1}>
      <VStack px={6} pb={3} pt={16}>
        <Header hasBackButton />
      </VStack>
      <ScrollView
        showsVerticalScrollIndicator={false}
        flex={1}
        _contentContainerStyle={{ pb: 30 }}
      >
        <VStack pb={6}>
          <Carousel productName={productInfo.name} imagesUri={imagesUri} />

          <VStack px={6} py={5}>
            <HStack alignItems="center">
              <UserPhoto
                size={6}
                borderWidth={2}
                borderColor="blue.300"
                alt="Imagem do usuário"
                photo={`http://127.0.0.1:3333/images/${productInfo.user.avatar}`}
              />
              <Text fontFamily="body" fontSize="sm" color="gray.100" ml={2}>
                {productInfo.user.name}
              </Text>
            </HStack>

            <VStack my={6}>
              <Badge title={productInfo.is_new ? 'new' : 'used'} />

              <HStack alignItems="center" justifyContent="space-between" my={2}>
                <Heading
                  fontFamily="heading"
                  fontSize="xl"
                  color="gray.100"
                  flexShrink={1}
                  numberOfLines={2}
                  mr={3}
                >
                  {productInfo.name}
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
                {productInfo.description}
              </Text>
            </VStack>

            <HStack alignItems="center" mb={4}>
              <Heading color="gray.200" fontFamily="heading" fontSize="sm">
                Aceita troca?
              </Heading>
              <Text color="gray.200" fontFamily="body" fontSize="sm" ml={2}>
                {productInfo.accept_trade ? 'Sim' : 'Não'}
              </Text>
            </HStack>

            <VStack>
              <Heading color="gray.200" fontFamily="heading" fontSize="sm">
                Meios de pagamento:
              </Heading>

              <VStack my={2}>
                {productInfo.payment_methods.map(({ key }) => (
                  <PaymentMethodsList key={key} method={key} />
                ))}
              </VStack>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
      <HStack
        px={6}
        pb={8}
        pt={6}
        backgroundColor="white"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text color="blue.500" fontFamily="heading" fontSize="2xl">
          <Text fontSize="sm">R$ </Text>
          {priceFormatted}
        </Text>
        <Button
          title="Entrar em contato"
          variant="default"
          leftIcon={
            <WhatsappLogo weight="fill" size={16} color={colors.gray[600]} />
          }
          mt={2}
          w="50%"
        />
      </HStack>
    </VStack>
  )
}
