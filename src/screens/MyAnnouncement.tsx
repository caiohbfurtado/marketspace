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
  AlertDialog,
} from 'native-base'
import { PencilSimpleLine, Power, TrashSimple } from 'phosphor-react-native'
import { Badge } from '../components/Badge'
import { UserPhoto } from '../components/UserPhoto'
import { AppNavigatorRoutesProps } from '../routes/app.routes'
import { useAuth } from '../hooks/useAuth'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { priceFormat } from '../utils/priceFormat'
import { api } from '../services/api'
import { AppError } from '../utils/AppError'
import { ProductDTO } from '../dtos/ProductDTO'
import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { Loading } from '../components/Loading'
import { Carousel } from '../components/Carousel'
import { PaymentMethodsList } from '../components/PaymentMethodsList'

type RouteParams = {
  productId: string
}

export function MyAnnouncement() {
  const route = useRoute()
  const { productId } = route.params as RouteParams
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const { colors } = useTheme()
  const { user } = useAuth()
  const toast = useToast()
  const [isLoadingButtonDeactivate, setIsLoadingButtonDeactivate] =
    useState(false)
  const [isLoadingButtonDelete, setIsLoadingButtonDelete] = useState(false)
  const [isLoadingInfo, setIsLoadingInfo] = useState(true)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [productInfo, setProductInfo] = useState<ProductDTO>({} as ProductDTO)
  const [imagesUri, setImagesUri] = useState<string[]>([])
  const cancelRef = useRef(null)

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
    } finally {
      setIsLoadingInfo(false)
    }
  }, [productId])

  useEffect(() => {
    getProductInfo()
  }, [getProductInfo])

  async function handleUpdateProductStatus() {
    try {
      setIsLoadingButtonDeactivate(true)
      const newStatus = !productInfo.is_active

      await api.patch(`/products/${productId}`, {
        is_active: newStatus,
      })
      setProductInfo((prevState) => ({ ...prevState, is_active: newStatus }))
    } catch (error) {
      console.log({ error })
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível alterar o status do produto. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
        _title: {
          textAlign: 'center',
        },
      })
    } finally {
      setIsLoadingButtonDeactivate(false)
    }
  }

  async function handleDeleteProduct() {
    try {
      setIsLoadingButtonDelete(true)
      await api.delete(`/products/${productId}`)

      toast.show({
        title: 'Anúncio excluído com sucesso',
        placement: 'top',
        bgColor: 'green.500',
        _title: {
          textAlign: 'center',
        },
      })

      navigation.navigate('MyAnnouncements')
      setIsOpenDialog(false)
    } catch (error) {
      console.log({ error })
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível deletar o produto. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
        _title: {
          textAlign: 'center',
        },
      })
    } finally {
      setIsLoadingButtonDelete(false)
    }
  }

  const priceFormatted = useMemo(
    () => priceFormat(productInfo.price),
    [productInfo.price],
  )

  if (isLoadingInfo) return <Loading />

  return (
    <VStack flex={1}>
      <ScrollView showsVerticalScrollIndicator={false} flex={1} pt={16}>
        <VStack pb={6}>
          <VStack px={6} pb={3}>
            <Header
              hasBackButton
              rightIcon={PencilSimpleLine}
              onPressRightIcon={() => {}}
            />
          </VStack>

          <Carousel productName={productInfo.name} imagesUri={imagesUri} />

          <VStack px={6} py={5}>
            <HStack alignItems="center">
              <UserPhoto
                size={6}
                borderWidth={2}
                borderColor="blue.300"
                alt="Imagem do usuário"
                photo={`http://127.0.0.1:3333/images/${user.avatar}`}
              />
              <Text fontFamily="body" fontSize="sm" color="gray.100" ml={2}>
                {user.name}
              </Text>
            </HStack>

            <VStack my={6}>
              <Badge title={productInfo.is_new ? 'new' : 'used'} />

              <HStack alignItems="center" justifyContent="space-between" my={2}>
                <Heading fontFamily="heading" fontSize="xl" color="gray.100">
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

            <VStack mt={6}>
              <Button
                title={`${
                  productInfo.is_active ? 'Desativar' : 'Ativar'
                } anúncio`}
                variant="dark"
                leftIcon={<Power size={16} color={colors.gray[600]} />}
                onPress={handleUpdateProductStatus}
                isLoading={isLoadingButtonDeactivate}
              />
              <Button
                title="Excluir anúncio"
                variant="light"
                leftIcon={<TrashSimple size={16} color={colors.gray[300]} />}
                mt={2}
                onPress={() => setIsOpenDialog(true)}
              />
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenDialog}>
        <AlertDialog.Content>
          <AlertDialog.Header fontSize="lg" fontWeight="bold">
            Excluir anúncio
          </AlertDialog.Header>
          <AlertDialog.Body>
            Você deseja realmente excluir o anúncio?{'\n'}
            Caso queira deixar ele invisível para os usuários, basta desativá-lo
          </AlertDialog.Body>
          <AlertDialog.Footer flexDirection="row">
            <HStack w="full">
              <Button
                title="Cancelar"
                buttonRef={cancelRef}
                onPress={() => setIsOpenDialog(false)}
                variant="light"
              />
              <Button
                title="Deletar"
                variant="dark"
                onPress={handleDeleteProduct}
                isLoading={isLoadingButtonDelete}
                ml={3}
              />
            </HStack>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </VStack>
  )
}
