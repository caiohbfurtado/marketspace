import { Text, useToast, VStack } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Logo from '@assets/logo.svg'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { AuthNavigatorRoutesProps } from '../routes/auth.routes'
import { useAuth } from '../hooks/useAuth'
import { AppError } from '../utils/AppError'
import { useState } from 'react'

type FormDataProps = {
  email: string
  password: string
}

const signInSchema = yup.object({
  email: yup
    .string()
    .required('E-mail obrigatório')
    .email('Informe um e-mail válido'),
  password: yup.string().required('Senha obrigatória'),
})

export function SignIn() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const toast = useToast()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      email: 'caio@email.com',
      password: '123456',
    },
  })

  function handleGoToSignUp() {
    navigation.navigate('SignUp')
  }

  async function handleSignIn({ email, password }: FormDataProps) {
    try {
      setIsLoading(true)

      await signIn({ email, password })
    } catch (error) {
      console.log({ error })
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível entrar. Tente novamente mais tarde.'

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
    <VStack flex={1} bg="white">
      <VStack
        bg="gray.600"
        alignItems="center"
        pt={32}
        borderBottomRightRadius={24}
        borderBottomLeftRadius={24}
      >
        <Logo />

        <VStack px="12" w="full" alignItems="center" mt={16}>
          <Text color="gray.200" fontFamily="body" mb={4}>
            Acesse sua conta
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.password?.message}
                secureTextEntry
              />
            )}
          />

          <Button
            title="Entrar"
            mb={16}
            mt={4}
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
        </VStack>
      </VStack>

      <VStack px="12" w="full" alignItems="center" mt={12}>
        <Text color="gray.200" fontFamily="body">
          Ainda não tem acesso?
        </Text>

        <Button
          title="Criar uma conta"
          variant="light"
          mb={16}
          mt={4}
          onPress={handleGoToSignUp}
        />
      </VStack>
    </VStack>
  )
}
