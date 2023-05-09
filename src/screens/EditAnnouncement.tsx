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
import { useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '../routes/app.routes'
import { FixedButtons } from '../components/FixedButtons'
import { useEffect, useState } from 'react'
import { Loading } from '../components/Loading'
import { ProductDTO } from '../dtos/ProductDTO'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

type FormDataProps = {
  name: string
  description: string
  is_new: 'is_new' | 'is_not_new'
  price: string
  payment_methods: string[]
  accept_trade: boolean
}

const editAnnouncementSchema = yup.object({
  name: yup.string().required('Título obrigatório'),
  description: yup.string().required('Descrição obrigatória'),
  is_new: yup.string().required('Condição do produto obrigatória'),
  price: yup
    .string()
    .required('Preço obrigatório')
    .not(['0'], 'Preço obrigatório'),
  payment_methods: yup
    .array()
    .min(1, 'Escolha pelo menos um método de pagamento')
    .required('Escolha pelo menos um método de pagamento'),
})

type RouteParams = {
  productInfo: ProductDTO
}

export function EditAnnouncement() {
  const route = useRoute()
  const { productInfo } = route.params as RouteParams
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormDataProps>({
    defaultValues: { accept_trade: false },
    resolver: yupResolver(editAnnouncementSchema),
  })

  console.log(productInfo)

  // function handleSubmitForm() {
  //   navigate('PreviewAnnouncement')
  // }

  function renderTitle(title: string) {
    return (
      <Heading color="gray.200" fontFamily="heading" fontSize="md">
        {title}
      </Heading>
    )
  }

  useEffect(() => {
    reset({
      accept_trade: productInfo.accept_trade,
      name: productInfo.name,
      description: productInfo.description,
      price: String(productInfo.price),
    })
  }, [
    productInfo.accept_trade,
    productInfo.description,
    productInfo.name,
    productInfo.price,
    reset,
  ])

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
          // onPress: handleSubmit,
        }}
      />
    </VStack>
  )
}
