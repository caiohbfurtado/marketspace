import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { FlatList, HStack, Select, Text, useTheme, VStack } from 'native-base'
import { CaretDown, Plus } from 'phosphor-react-native'
import { Header } from '../components/Header'
import { ProductCard } from '../components/ProductCard'
import { AppNavigatorRoutesProps } from '../routes/app.routes'
import { useCallback, useState } from 'react'
import { api } from '../services/api'
import { ProductDTO } from '../dtos/ProductDTO'
import { Loading } from '../components/Loading'

export function MyAnnouncements() {
  const { colors, space } = useTheme()
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const [isLoading, setIsLoading] = useState(true)
  const [selectValue, setSelectValue] = useState('todos')
  const [allProducts, setAllProducts] = useState<ProductDTO[]>([])
  const [selectedProducts, setSelectedProducts] = useState<ProductDTO[]>([])
  function handleGoToCreateAnnouncement() {
    navigate('CreateAnnouncement', { isNewProduct: true })
  }

  function handleGoToAnnouncement(id: string) {
    navigate('MyAnnouncement', { productId: id })
  }

  async function getAnnouncementsByStatus() {
    try {
      setIsLoading(true)
      const response = await api.get<ProductDTO[]>('/users/products')
      setAllProducts(response.data)
      setSelectedProducts(response.data)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      setSelectValue('todos')
      getAnnouncementsByStatus()
    }, []),
  )

  function handleChangeActiveValue(value: string) {
    setSelectValue(value)

    if (value === 'todos') {
      setSelectedProducts(allProducts)
      return
    }

    if (value === 'ativos') {
      setSelectedProducts(allProducts.filter((product) => product.is_active))
      return
    }

    setSelectedProducts(allProducts.filter((product) => !product.is_active))
  }

  if (isLoading) return <Loading />

  function renderHeader() {
    return (
      <VStack pt={16} mb={5}>
        <Header
          title="Meus anúncios"
          hasBackButton={false}
          rightIcon={Plus}
          onPressRightIcon={handleGoToCreateAnnouncement}
        />

        <HStack alignItems="center" justifyContent="space-between" mt={8}>
          <Text>{selectedProducts.length} anúncios</Text>

          <Select
            minWidth="111"
            accessibilityLabel="Choose Service"
            placeholder="Choose Service"
            selectedValue={selectValue}
            dropdownIcon={<CaretDown size={16} style={{ marginRight: 14.5 }} />}
            fontSize="sm"
            color="gray.100"
            onValueChange={handleChangeActiveValue}
          >
            <Select.Item label="Todos" value="todos" />
            <Select.Item label="Ativos" value="ativos" />
            <Select.Item label="Inativos" value="inativos" />
          </Select>
        </HStack>
      </VStack>
    )
  }

  return (
    <FlatList
      data={selectedProducts}
      renderItem={({ item }) => (
        <ProductCard
          isUser
          product={item}
          onPress={() => handleGoToAnnouncement(item.id)}
        />
      )}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      style={{ flexGrow: 1, backgroundColor: colors.gray[600] }}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={{
        marginHorizontal: space[6],
      }}
    />
  )
}
