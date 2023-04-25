import { useFocusEffect, useNavigation } from '@react-navigation/native'
import {
  HStack,
  Text,
  VStack,
  useTheme,
  Heading,
  FlatList,
  Divider,
  Pressable,
} from 'native-base'
import {
  ArrowRight,
  MagnifyingGlass,
  Sliders,
  Tag,
} from 'phosphor-react-native'
import { TouchableOpacity } from 'react-native'
import { Checkbox } from '../components/Checkbox'
import { HomeHeader } from '../components/HomeHeader'
import { ProductCard } from '../components/ProductCard'
import { AppNavigatorRoutesProps } from '../routes/app.routes'
import { useCallback, useState } from 'react'
import { BottomSheet } from '../components/BottomSheet'
import { TagRemovable } from '../components/TagRemovable'
import { Button } from '../components/Button'
import { useForm, Controller } from 'react-hook-form'
import { Switch } from '../components/Switch'
import { ProductDTO } from '../dtos/ProductDTO'
import { api } from '../services/api'
import { Loading } from '../components/Loading'
import { Input } from '../components/Input'

type FormDataProps = {
  is_new: ('is_new' | 'is_not_new')[]
  payment_methods: string[]
  accept_trade: boolean
  name: string
}

export function Home() {
  const { colors, space } = useTheme()
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false)
  const { control, handleSubmit, reset } = useForm<FormDataProps>({})
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingReset, setIsLoadingReset] = useState(false)
  const [isLoadingSearch, setIsLoadingSearch] = useState(false)

  function handleGoToMyAnnouncements() {
    navigate('MyAnnouncements')
  }

  function renderSectionTitle(subtitle: string) {
    return (
      <Text color="gray.200" fontSize="md" fontFamily="heading">
        {subtitle}
      </Text>
    )
  }

  async function getAllProducts() {
    try {
      setIsLoading(true)
      const response = await api.get<ProductDTO[]>('/products')
      setProducts(response.data)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      getAllProducts()
    }, []),
  )

  async function handleSearchProduct(data: FormDataProps) {
    try {
      setIsLoadingSearch(true)
      const nameSearch = data?.name ? `query=${data?.name}` : ''
      const isNewSearchArray = data?.is_new
        ? data?.is_new.map(
            (isNewCondition: 'is_new' | 'is_not_new') =>
              `is_new=${isNewCondition === 'is_new'}`,
          )
        : []
      const isNewSearch =
        isNewSearchArray.length === 0 || isNewSearchArray.length === 2
          ? ''
          : isNewSearchArray.join('')
      const acceptTradeSearch =
        data?.accept_trade !== undefined
          ? `accept_trade=${data?.accept_trade}`
          : ''
      const paymentMethodsSearch = data?.payment_methods
        ? data?.payment_methods
            .map(
              (method, index) =>
                `${index !== 0 && '&'}payment_methods=${method}`,
            )
            .join('')
        : ''

      const myQuery = [
        nameSearch ?? undefined,
        isNewSearch ?? undefined,
        acceptTradeSearch ?? undefined,
        paymentMethodsSearch ?? undefined,
      ]
        .filter((value) => value)
        .join('&')

      const response = await api.get<ProductDTO[]>(`/products/?${myQuery}`)

      setProducts(response.data)
    } catch (error) {
    } finally {
      setIsOpenBottomSheet(false)
      setIsLoadingSearch(false)
    }
  }

  function handleClearAllFilters() {
    setIsLoadingReset(true)

    setTimeout(() => {
      reset({
        accept_trade: undefined,
        is_new: [],
        name: undefined,
        payment_methods: undefined,
      })
      setIsLoadingReset(false)
    }, 200)
  }

  if (isLoading) return <Loading />

  function renderHomeHeader() {
    return (
      <VStack mt={16} mb={6}>
        <HomeHeader />

        <VStack my={8}>
          <Text fontFamily="body" fontSize="sm" color="gray.300" mb={3}>
            Seus produtos anunciados para venda
          </Text>

          <TouchableOpacity onPress={handleGoToMyAnnouncements}>
            <HStack
              bg=" rgba(100, 122, 199, 0.1)"
              alignItems="center"
              justifyContent="space-between"
              py={3}
              px={4}
              borderRadius={6}
            >
              <Tag size={20} color={colors.blue[500]} />

              <VStack flex={1} ml={4}>
                <Heading fontFamily="heading" fontSize="xl" color="gray.200">
                  4
                </Heading>
                <Text fontFamily="body" fontSize="xs" color="gray.200">
                  anúncios salvos
                </Text>
              </VStack>

              <HStack alignItems="center">
                <Text
                  fontSize="xs"
                  fontFamily="heading"
                  color="blue.500"
                  mr={2}
                >
                  Meus anúncios
                </Text>
                <ArrowRight size={16} color={colors.blue[500]} />
              </HStack>
            </HStack>
          </TouchableOpacity>
        </VStack>

        <Text fontFamily="body" fontSize="sm" color="gray.300" mb={3}>
          Compre produtos variados
        </Text>

        <Pressable
          alignItems="center"
          justifyContent="center"
          onPress={() => setIsOpenBottomSheet(true)}
        >
          <Controller
            name="name"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                placeholder="Buscar anúncio"
                marginBottom="0"
                pointerEvents="none"
                isFocused={isOpenBottomSheet}
              />
            )}
          />

          <HStack position="absolute" right={4} pointerEvents="none">
            <TouchableOpacity onPress={handleSubmit(handleSearchProduct)}>
              <MagnifyingGlass color={colors.gray[200]} size={20} />
            </TouchableOpacity>
            <Divider orientation="vertical" bg="gray.400" mx={3} />
            <TouchableOpacity
              style={{ zIndex: 10 }}
              onPress={() => setIsOpenBottomSheet(true)}
            >
              <Sliders size={20} color={colors.gray[200]} />
            </TouchableOpacity>
          </HStack>
        </Pressable>
      </VStack>
    )
  }

  return (
    <>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        style={{ flexGrow: 1, backgroundColor: colors.gray[600] }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHomeHeader}
        contentContainerStyle={{
          marginHorizontal: space[6],
        }}
      />

      <BottomSheet
        isOpen={isOpenBottomSheet}
        onClose={() => setIsOpenBottomSheet(false)}
        renderFooter={() => (
          <HStack>
            <Button
              title="Resetar filtros"
              variant="light"
              mr={3}
              onPress={handleClearAllFilters}
              isLoading={isLoadingReset}
            />
            <Button
              title="Aplicar filtros"
              variant="dark"
              onPress={handleSubmit(handleSearchProduct)}
              isLoading={isLoadingSearch}
            />
          </HStack>
        )}
      >
        <VStack flex={1}>
          <HStack alignItems="center" mt={6}>
            <Controller
              name="name"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  placeholder="Buscar anúncio"
                  marginBottom="0"
                  onSubmitEditing={handleSubmit(handleSearchProduct)}
                  autoFocus
                />
              )}
            />
          </HStack>

          <VStack mt={6}>
            {renderSectionTitle('Condição')}

            <HStack mt={3}>
              <Controller
                name="is_new"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TagRemovable
                    value={value}
                    onChange={onChange}
                    options={[
                      { label: 'NOVO', value: 'is_new' },
                      { label: 'USADO', value: 'is_not_new' },
                    ]}
                  />
                )}
              />
            </HStack>
          </VStack>

          <VStack mt={6}>
            {renderSectionTitle('Aceita troca?')}
            <Controller
              name="accept_trade"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Switch onToggle={onChange} isChecked={value} />
              )}
            />
          </VStack>

          <VStack mt={6}>
            {renderSectionTitle('Meios de pagamento aceitos')}
            <Controller
              name="payment_methods"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  onChange={onChange}
                  value={value}
                  options={[
                    { label: 'Boleto', value: 'boleto' },
                    { label: 'Pix', value: 'pix' },
                    { label: 'Dinheiro', value: 'cash' },
                    { label: 'Cartão de crédito', value: 'card' },
                    { label: 'Cartão de débito', value: 'deposit' },
                  ]}
                />
              )}
            />
          </VStack>
        </VStack>
      </BottomSheet>
    </>
  )
}
