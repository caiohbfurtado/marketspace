import { useNavigation } from '@react-navigation/native'
import { Heading, HStack, Text, useTheme, VStack } from 'native-base'
import { Plus } from 'phosphor-react-native'
import { useAuth } from '../hooks/useAuth'
import { AppNavigatorRoutesProps } from '../routes/app.routes'
import { Button } from './Button'
import { UserPhoto } from './UserPhoto'
import { api } from '../services/api'

export function HomeHeader() {
  const { colors } = useTheme()
  const { navigate } = useNavigation<AppNavigatorRoutesProps>()
  const { user } = useAuth()

  function handleGoToCreateAnnouncement() {
    navigate('CreateAnnouncement', { isNewProduct: true })
  }

  return (
    <HStack justifyContent="space-between" alignItems="center">
      <HStack flex={1}>
        <UserPhoto
          size={45}
          borderWidth={2}
          borderColor="blue.300"
          alt="Foto do usuário"
          photo={`${api.defaults.baseURL}/images/${user.avatar}`}
        />

        <VStack ml={3}>
          <Text fontFamily="body" fontSize="md" color="gray.100">
            Boas vindas,
          </Text>
          <Heading fontFamily="heading" fontSize="md" color="gray.100">
            {user.name}!
          </Heading>
        </VStack>
      </HStack>

      <Button
        title="Criar anúncio"
        variant="dark"
        width={140}
        startIcon={<Plus size={16} color={colors.gray[700]} weight="bold" />}
        onPress={handleGoToCreateAnnouncement}
      />
    </HStack>
  )
}
