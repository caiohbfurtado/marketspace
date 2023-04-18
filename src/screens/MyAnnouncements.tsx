import { useNavigation } from '@react-navigation/native'
import { FlatList, HStack, Select, Text, useTheme, VStack } from 'native-base'
import { CaretDown, Plus } from 'phosphor-react-native'
import { Header } from '../components/Header'
import { ProductCard } from '../components/ProductCard'
import { AppNavigatorRoutesProps } from '../routes/app.routes'

export function MyAnnouncements() {
  const { colors, space } = useTheme()
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()

  function handleGoToCreateAnnouncement() {
    navigate('CreateAnnouncement')
  }

  function handleGoToPreviewAnnouncement() {
    navigate('PreviewAnnouncement', { createAnnouncement: false })
  }

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
          <Text>9 anúncios</Text>

          <Select
            minWidth="111"
            accessibilityLabel="Choose Service"
            placeholder="Choose Service"
            selectedValue="todos"
            dropdownIcon={<CaretDown size={16} style={{ marginRight: 14.5 }} />}
            fontSize="sm"
            color="gray.100"
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
      data={[0, 1, 2, 3, 4, 5, 6, 7]}
      renderItem={() => <ProductCard onPress={handleGoToPreviewAnnouncement} />}
      keyExtractor={(item) => String(item)}
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
