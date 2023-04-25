import {
  Checkbox,
  Heading,
  HStack,
  Radio,
  ScrollView,
  Switch,
  Text,
  VStack,
} from 'native-base'
import { Header } from '@components/Header'
import { AddImageButton } from '../components/AddImageButton'
import { Input } from '../components/Input'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '../routes/app.routes'
import { FixedButtons } from '../components/FixedButtons'

export function EditAnnouncement() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()

  function handleSubmit() {
    navigate('PreviewAnnouncement')
  }

  function renderTitle(title: string) {
    return (
      <Heading color="gray.200" fontFamily="heading" fontSize="md">
        {title}
      </Heading>
    )
  }

  return (
    <VStack flex={1} bg="gray.600">
      <ScrollView px={6} pt={16} showsVerticalScrollIndicator={false}>
        <Header title="Editar anúncio" />
        <VStack>
          <VStack mt={6} pb={32}>
            {renderTitle('Imagens')}

            <Text
              color="gray.300"
              fontFamily="body"
              fontSize="sm"
              mb={4}
              mt={1}
            >
              Escolha até 3 imagens para mostrar o quanto seu produto é
              incrível!
            </Text>

            <AddImageButton />

            <VStack mt={8}>
              {renderTitle('Sobre o produto')}
              <Input placeholder="Título do anúncio" mt={4} />
              <Input placeholder="Descrição do produto" h={40} multiline />

              <Radio.Group
                name="productState"
                accessibilityLabel="Tipo do produto"
                direction="row"
              >
                <VStack mr={4} mb={8}>
                  <Radio
                    value="one"
                    bg="transparent"
                    borderColor="gray.400"
                    _checked={{
                      borderColor: 'blue.300',
                      _icon: {
                        color: 'blue.300',
                      },
                    }}
                    _text={{
                      fontFamily: 'body',
                      fontSize: 'md',
                      color: 'gray.200',
                    }}
                  >
                    Produto novo
                  </Radio>
                </VStack>
                <Radio
                  value="two"
                  bg="transparent"
                  borderColor="gray.400"
                  _checked={{
                    borderColor: 'blue.300',
                    _icon: {
                      color: 'blue.300',
                    },
                  }}
                >
                  Produto usado
                </Radio>
              </Radio.Group>

              {renderTitle('Venda')}
              <HStack alignItems="center" my={4}>
                <Input placeholder="Valor do produto" mb={0} pl={44} />
                <Text position="absolute" left={4}>
                  R$
                </Text>
              </HStack>

              {renderTitle('Aceita troca?')}
              <Switch
                offTrackColor="gray.500"
                onTrackColor="blue.300"
                mt={3}
                mb={4}
              />

              {renderTitle('Meios de pagamento aceitos')}

              <Checkbox.Group
                accessibilityLabel="Escolha os meios de pagamento válidos"
                mt={3}
              >
                <Checkbox value="boleto" mb={2}>
                  Boleto
                </Checkbox>
                <Checkbox value="pix" mb={2}>
                  Pix
                </Checkbox>
                <Checkbox value="dinheiro" mb={2}>
                  Dinheiro
                </Checkbox>
                <Checkbox value="credito" mb={2}>
                  Cartão de crédito
                </Checkbox>
                <Checkbox value="debito" mb={2}>
                  Cartão de débito
                </Checkbox>
              </Checkbox.Group>
            </VStack>
          </VStack>
        </VStack>
      </ScrollView>
      <FixedButtons
        leftButton={{ title: 'Cancelar', variant: 'light' }}
        rightButton={{
          title: 'Avançar',
          variant: 'dark',
          onPress: handleSubmit,
        }}
      />
    </VStack>
  )
}
