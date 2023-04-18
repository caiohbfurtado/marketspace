import { useNavigation } from '@react-navigation/native'
import {
  HStack,
  Text,
  VStack,
  useTheme,
  Heading,
  FlatList,
  Switch,
  Checkbox as CheckboxNativeBase,
} from 'native-base'
import { ArrowRight, Tag } from 'phosphor-react-native'
import { LogBox, TouchableOpacity } from 'react-native'
import { Checkbox } from '../components/Checkbox'
import { HomeHeader } from '../components/HomeHeader'
import { ProductCard } from '../components/ProductCard'
import { Search } from '../components/Search'
import { AppNavigatorRoutesProps } from '../routes/app.routes'
import { useState } from 'react'
import { BottomSheet } from '../components/BottomSheet'
import { TagRemovable } from '../components/TagRemovable'
import { Button } from '../components/Button'

LogBox.ignoreLogs([
  'We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320',
])

export function Home() {
  const { colors, space } = useTheme()
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false)
  const [acceptExchange, setAcceptExchange] = useState(false)
  const [condition, setCondition] = useState<string[]>([])
  const [paymentMethods, setPaymentMethods] = useState([])

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

  function handleChangeCondition(value: string) {
    const existsInConditions = condition.find((cond) => cond === value)

    if (existsInConditions) {
      setCondition((prevState) => prevState.filter((cond) => cond !== value))
      return
    }

    setCondition((prevState) => [...prevState, value])
  }

  const handleChangeSwitch = (value: boolean) => {
    setAcceptExchange(value)
  }

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

        <Search onFilter={() => setIsOpenBottomSheet(true)} />
      </VStack>
    )
  }

  return (
    <>
      <FlatList
        data={[0, 1, 2, 3, 4, 5, 6, 7]}
        renderItem={() => <ProductCard />}
        keyExtractor={(item) => String(item)}
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
            <Button title="Resetar filtros" variant="light" mr={3} />
            <Button title="Aplicar filtros" variant="dark" />
          </HStack>
        )}
      >
        <VStack flex={1}>
          <VStack mt={6}>
            {renderSectionTitle('Condição')}

            <HStack mt={3}>
              <TagRemovable
                title="Novo"
                active={condition.includes('new')}
                onPress={() => handleChangeCondition('new')}
              />
              <TagRemovable
                title="Usado"
                active={condition.includes('used')}
                onPress={() => handleChangeCondition('used')}
              />
            </HStack>
          </VStack>

          <VStack mt={6}>
            {renderSectionTitle('Aceita troca?')}
            <Switch
              value={acceptExchange}
              onValueChange={handleChangeSwitch}
              size="md"
              mt={3}
              onThumbColor="gray.700"
              offThumbColor="gray.700"
              onTrackColor="blue.300"
              offTrackColor="gray.500"
            />
          </VStack>

          <VStack mt={6}>
            {renderSectionTitle('Meios de pagamento aceitos')}

            <CheckboxNativeBase.Group
              accessibilityLabel="Escolha os meios de pagamento válidos"
              mt={3}
              onChange={setPaymentMethods}
              value={paymentMethods}
            >
              <Checkbox value="boleto" label="Boleto" />
              <Checkbox value="pix" label="Pix" />
              <Checkbox value="dinheiro" label="Dinheiro" />
              <Checkbox value="credito" label="Cartão de crédito" />
              <Checkbox value="debito" label="Cartão de débito" />
            </CheckboxNativeBase.Group>
          </VStack>
        </VStack>
      </BottomSheet>
    </>
  )
}
