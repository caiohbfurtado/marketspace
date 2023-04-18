import {
  Heading,
  HStack,
  KeyboardAvoidingView,
  ScrollView,
  Switch,
  Text,
  useToast,
  VStack,
} from 'native-base'
import { Header } from '@components/Header'
import { AddImageButton } from '../components/AddImageButton'
import { Input } from '../components/Input'
// import { useNavigation } from '@react-navigation/native'
// import { AppNavigatorRoutesProps } from '../routes/app.routes'
import { FixedButtons } from '../components/FixedButtons'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { useState } from 'react'
import { AppError } from '../utils/AppError'
import { Loading } from '../components/Loading'
import { ProductImage } from '../components/ProductImage'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Checkbox } from '../components/Checkbox'
import { Radio } from '../components/Radio'

type FormDataProps = {
  title: string
  description: string
  is_new: 'is_new' | 'is_not_new'
  price: string
  payment_methods: string[]
}

const createAnnouncementSchema = yup.object({
  title: yup.string().required('Título obrigatório'),
  description: yup.string().required('Descrição obrigatória'),
  is_new: yup.string().required('Condição do produto obrigatória'),
  price: yup.string().required('Preço obrigatório'),
  payment_methods: yup
    .array()
    .min(1, 'Escolha pelo menos um método de pagamento'),
})

export function CreateAnnouncement() {
  // const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const toast = useToast()
  const [productPhotoIsLoading, setProductPhotoIsLoading] = useState(false)
  const [productInfoPhotos, setProductInfoPhotos] = useState<
    ImagePicker.ImagePickerAsset[]
  >([])
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(createAnnouncementSchema),
  })

  function handleCreateAnnouncement(data: FormDataProps) {
    console.log('entrou', { data })

    // navigate('PreviewAnnouncement', { createAnnouncement: true })
  }

  function renderTitle(title: string) {
    return (
      <Heading color="gray.200" fontFamily="heading" fontSize="md">
        {title}
      </Heading>
    )
  }

  async function handleProductsPhotoSelect() {
    try {
      setProductPhotoIsLoading(true)
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      if (photoSelected.assets.length > 0) {
        const photo = photoSelected.assets[0]

        const photoInfo = await FileSystem.getInfoAsync(photo.uri)

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          throw new AppError(
            'Essa imagem é muito grande. Escolha uma de até 5MB',
          )
        }

        setProductInfoPhotos((oldValue) => [...oldValue, photo])
      }
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi padicionar a imagem. Tente novamente'
      console.log(title)

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
        _text: {
          textAlign: 'center',
        },
      })
    } finally {
      setProductPhotoIsLoading(false)
    }
  }

  function handleRemoveImage(index: number) {
    setProductInfoPhotos((oldValue) =>
      oldValue.filter((_, photoIndex) => photoIndex !== index),
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      flex={1}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <VStack onStartShouldSetResponder={() => true} flex={1} bg="gray.600">
          <ScrollView px={6} pt={16} showsVerticalScrollIndicator={false}>
            <View onStartShouldSetResponder={() => true}>
              <Header title="Criar anúncio" />
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

                  <HStack>
                    {!productPhotoIsLoading ? (
                      productInfoPhotos.map((photoInfo, index) => (
                        <ProductImage
                          key={String(index)}
                          photo={photoInfo.uri}
                          style={{ marginRight: 8 }}
                          onRemoveImage={() => handleRemoveImage(index)}
                        />
                      ))
                    ) : (
                      <Loading />
                    )}

                    {(productInfoPhotos.length === 0 ||
                      productInfoPhotos.length < 3) &&
                      !productPhotoIsLoading && (
                        <AddImageButton onPress={handleProductsPhotoSelect} />
                      )}
                  </HStack>

                  <VStack mt={8}>
                    {renderTitle('Sobre o produto')}
                    <Controller
                      name="title"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          value={value}
                          onChangeText={onChange}
                          placeholder="Título do anúncio"
                          mt={4}
                          errorMessage={errors.title?.message}
                        />
                      )}
                    />

                    <Controller
                      name="description"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Input
                          value={value}
                          onChangeText={onChange}
                          placeholder="Descrição do produto"
                          h={40}
                          multiline
                          errorMessage={errors.description?.message}
                        />
                      )}
                    />

                    <Controller
                      name="is_new"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Radio
                          onChange={onChange}
                          errorMessage={errors.is_new?.message}
                          options={[
                            { label: 'Produto novo', value: 'is_new' },
                            { label: 'Produto usado', value: 'is_not_new' },
                          ]}
                        />
                      )}
                    />

                    {renderTitle('Venda')}
                    <HStack alignItems="center" my={4}>
                      <Controller
                        name="price"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <Input
                            placeholder="Valor do produto"
                            preffix="R$"
                            value={value}
                            onChangeText={onChange}
                            keyboardType="numeric"
                            errorMessage={errors.price?.message}
                          />
                        )}
                      />
                    </HStack>

                    {renderTitle('Aceita troca?')}
                    <Switch
                      mt={3}
                      mb={4}
                      onThumbColor="gray.700"
                      offThumbColor="gray.700"
                      onTrackColor="blue.300"
                      offTrackColor="gray.500"
                    />

                    {renderTitle('Meios de pagamento aceitos')}

                    <Controller
                      name="payment_methods"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Checkbox
                          onChange={onChange}
                          errorMessage={errors.payment_methods?.message}
                          options={[
                            { label: 'Boleto', value: 'boleto' },
                            { label: 'Pix', value: 'pix' },
                            { label: 'Dinheiro', value: 'dinheiro' },
                            { label: 'Cartão de crédito', value: 'credito' },
                            { label: 'Cartão de débito', value: 'debito' },
                          ]}
                        />
                      )}
                    />
                  </VStack>
                </VStack>
              </VStack>
            </View>
          </ScrollView>
          <FixedButtons
            leftButton={{ title: 'Cancelar', variant: 'light' }}
            rightButton={{
              title: 'Avançar',
              variant: 'dark',
              onPress: handleSubmit(handleCreateAnnouncement),
            }}
          />
        </VStack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
