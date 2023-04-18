import {
  Heading,
  ScrollView,
  Skeleton,
  Text,
  useTheme,
  useToast,
  VStack,
} from 'native-base'
import { PencilSimpleLine } from 'phosphor-react-native'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'

import MinimalistLogoSVG from '@assets/minimalist-logo.svg'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { UserPhoto } from '../components/UserPhoto'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { api } from '../services/api'
import { AppError } from '../utils/AppError'
import { useAuth } from '../hooks/useAuth'

type FormDataProps = {
  name: string
  email: string
  tel: string
  password: string
  confirm_password: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Nome obrigatório'),
  email: yup
    .string()
    .required('E-mail obrigatório')
    .email('Informe um e-mail válido'),
  tel: yup.string().required('Telefone obrigatório'),
  password: yup
    .string()
    .required('Senha obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 dígitos'),
  confirm_password: yup
    .string()
    .required('Confirmação de senha obrigatória')
    .oneOf([yup.ref('password')], 'A confirmação da senha não confere'),
})

const PHOTO_SIZE = 88

export function SignUp() {
  const navigation = useNavigation()
  const { colors } = useTheme()
  const toast = useToast()
  const { signIn } = useAuth()

  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [avatarInfo, setAvatarInfo] = useState<ImagePicker.ImagePickerAsset>(
    {} as ImagePicker.ImagePickerAsset,
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: 'Caio',
      email: 'caio@email.com',
      password: '123456',
      confirm_password: '123456',
      tel: '15998316639',
    },
  })

  async function handleUserPhotoSelect() {
    try {
      setPhotoIsLoading(true)
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
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
        )

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB',
            placement: 'top',
            bgColor: 'red.500',
            _text: {
              textAlign: 'center',
            },
          })
          return
        }

        setAvatarInfo(photoSelected.assets[0])
      }
    } catch (error) {
      toast.show({
        title: 'Não foi possível adicionar imagem de avatar. Tente novamente.',
        placement: 'top',
        bgColor: 'red.500',
        _text: {
          textAlign: 'center',
        },
      })
    } finally {
      setPhotoIsLoading(false)
    }
  }

  function handleGoBack() {
    navigation.goBack()
  }

  async function handleSignUp({ email, name, password, tel }: FormDataProps) {
    try {
      setIsLoading(true)

      if (!avatarInfo.uri) {
        throw new AppError('A imagem é obrigatória')
      }

      const fileExtension = avatarInfo.uri.split('.').pop()
      const photoFile = {
        name: `avatar.${fileExtension}`.toLowerCase().replace(' ', '-'),
        uri: avatarInfo.uri,
        type: `${avatarInfo.type}/${fileExtension}`,
      } as any

      const dataForm = new FormData()
      dataForm.append('avatar', photoFile)
      dataForm.append('name', name)
      dataForm.append('email', email)
      dataForm.append('password', password)
      dataForm.append('tel', tel)

      await api.post('users', dataForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      await signIn({ email, password })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível criar a conta. Tente novamente mais tarde.'

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
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      bg="gray.600"
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={12} pt={16} mb={16} alignItems="center">
        <MinimalistLogoSVG />
        <Heading
          fontFamily="heading"
          color="gray.100"
          fontSize="xl"
          mt={3}
          mb={2}
        >
          Boas vindas!
        </Heading>

        <Text textAlign="center" fontFamily="body" fontSize="sm" mb={8}>
          Crie sua conta e use o espaço para comprar itens variados e vender
          seus produtos
        </Text>

        <VStack mb={4}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.600"
              endColor="gray.500"
              borderWidth={3}
              borderColor="blue.300"
            />
          ) : (
            <UserPhoto
              size={PHOTO_SIZE}
              alt="Imagem do usuário"
              {...(avatarInfo.uri && { source: { uri: avatarInfo.uri } })}
              borderWidth={3}
              borderColor="blue.300"
            />
          )}
          <TouchableOpacity
            style={{
              backgroundColor: colors.blue[300],
              alignSelf: 'flex-start',
              height: 40,
              width: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}
            onPress={handleUserPhotoSelect}
          >
            <PencilSimpleLine size={16} color={colors.gray[600]} />
          </TouchableOpacity>
        </VStack>

        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Nome"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="E-mail"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          name="tel"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Telefone"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.tel?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Senha"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password?.message}
              secureTextEntry
            />
          )}
        />

        <Controller
          name="confirm_password"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Confirmar senha"
              onChangeText={onChange}
              value={value}
              errorMessage={errors.confirm_password?.message}
              secureTextEntry
            />
          )}
        />

        <Button
          title="Criar"
          variant="dark"
          mt={2}
          mb={10}
          onPress={handleSubmit(handleSignUp)}
          isLoading={isLoading}
        />

        <Text fontFamily="body" fontSize="sm">
          Já tem uma conta?
        </Text>

        <Button
          title="Ir para o login"
          variant="light"
          mt={4}
          onPress={handleGoBack}
        />
      </VStack>
    </ScrollView>
  )
}
