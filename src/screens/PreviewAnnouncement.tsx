import { useNavigation, useRoute } from '@react-navigation/native'
import {
  Box,
  Heading,
  HStack,
  ScrollView,
  Text,
  useTheme,
  VStack,
} from 'native-base'
import {
  ArrowLeft,
  Bank,
  Barcode,
  CreditCard,
  Money,
  PencilSimpleLine,
  Power,
  QrCode,
  Tag,
  TrashSimple,
} from 'phosphor-react-native'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { FixedButtons } from '../components/FixedButtons'
import { Header } from '../components/Header'
import { UserPhoto } from '../components/UserPhoto'
import { AppNavigatorRoutesProps } from '../routes/app.routes'

type RouteParams = {
  createAnnouncement: boolean
  id: string
}

export function PreviewAnnouncement() {
  const route = useRoute()
  const { createAnnouncement, id } = route.params as RouteParams
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const { colors } = useTheme()

  function handleGoBack() {
    navigation.goBack()
  }

  function handleEditAnnouncement() {
    navigation.navigate('EditAnnouncement', { id })
  }

  return (
    <VStack flex={1}>
      {createAnnouncement && (
        <VStack
          position="fixed"
          h={32}
          bg="blue.300"
          alignItems="center"
          justifyContent="flex-end"
          pb={4}
        >
          <Heading color="gray.700" fontFamily="heading" fontSize="md" mb={0.5}>
            Pré visualização do anúncio
          </Heading>
          <Text color="gray.700" fontFamily="body" fontSize="md">
            É assim que seu produto vai aparecer!
          </Text>
        </VStack>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        flex={1}
        {...(!createAnnouncement && { pt: 16 })}
      >
        <VStack pb={createAnnouncement ? 6 : 20}>
          {!createAnnouncement && (
            <VStack px={6} pb={3}>
              <Header
                hasBackButton
                rightIcon={PencilSimpleLine}
                onPressRightIcon={handleEditAnnouncement}
              />
            </VStack>
          )}

          <Box h={280} w="full" bg="black" />

          <VStack px={6} py={5}>
            <HStack alignItems="center">
              <UserPhoto
                size={6}
                borderWidth={2}
                borderColor="blue.300"
                alt="Imagem do usuário"
              />
              <Text fontFamily="body" fontSize="sm" color="gray.100" ml={2}>
                Maria Gomes
              </Text>
            </HStack>

            <VStack my={6}>
              <Badge title="used" />

              <HStack alignItems="center" justifyContent="space-between" my={2}>
                <Heading fontFamily="heading" fontSize="xl" color="gray.100">
                  Luminária pendente
                </Heading>

                <HStack alignItems="center">
                  <Text
                    fontFamily="heading"
                    fontSize="sm"
                    color="blue.300"
                    mr={1}
                    mt={0.5}
                  >
                    R$
                  </Text>
                  <Text fontFamily="heading" fontSize="xl" color="blue.300">
                    45,00
                  </Text>
                </HStack>
              </HStack>

              <Text fontFamily="body" color="gray.200" fontSize="sm">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero
                adipisci consequuntur, et impedit officiis totam natus quibusdam
                quod architecto odit dolore repellat consectetur pariatur quas
                tempore non maiores rem iure.
              </Text>
            </VStack>

            <HStack alignItems="center" mb={4}>
              <Heading color="gray.200" fontFamily="heading" fontSize="sm">
                Aceita troca?
              </Heading>
              <Text color="gray.200" fontFamily="body" fontSize="sm" ml={2}>
                Não
              </Text>
            </HStack>

            <VStack>
              <Heading color="gray.200" fontFamily="heading" fontSize="sm">
                Meios de pagamento:
              </Heading>

              <VStack my={2}>
                <HStack alignItems="center">
                  <Barcode color={colors.gray[100]} size={18} />
                  <Text fontFamily="body" fontSize="sm" color="gray.200" ml={2}>
                    Boleto
                  </Text>
                </HStack>

                <HStack alignItems="center">
                  <QrCode color={colors.gray[100]} size={18} />
                  <Text fontFamily="body" fontSize="sm" color="gray.200" ml={2}>
                    Pix
                  </Text>
                </HStack>

                <HStack alignItems="center">
                  <Money color={colors.gray[100]} size={18} />
                  <Text fontFamily="body" fontSize="sm" color="gray.200" ml={2}>
                    Dinheiro
                  </Text>
                </HStack>

                <HStack alignItems="center">
                  <CreditCard color={colors.gray[100]} size={18} />
                  <Text fontFamily="body" fontSize="sm" color="gray.200" ml={2}>
                    Cartão de Crédito
                  </Text>
                </HStack>

                <HStack alignItems="center">
                  <Bank color={colors.gray[100]} size={18} />
                  <Text fontFamily="body" fontSize="sm" color="gray.200" ml={2}>
                    Depósito Bancário
                  </Text>
                </HStack>
              </VStack>
            </VStack>

            {!createAnnouncement && (
              <VStack mt={6}>
                <Button
                  title="Desativar anúncio"
                  variant="dark"
                  leftIcon={<Power size={16} color={colors.gray[600]} />}
                />
                <Button
                  title="Excluir anúncio"
                  variant="light"
                  leftIcon={<TrashSimple size={16} color={colors.gray[300]} />}
                  mt={2}
                />
              </VStack>
            )}
          </VStack>
        </VStack>
      </ScrollView>

      {createAnnouncement && (
        <FixedButtons
          leftButton={{
            title: 'Voltar e editar',
            variant: 'light',
            leftIcon: <ArrowLeft size={16} color={colors.gray[200]} />,
            onPress: handleGoBack,
          }}
          rightButton={{
            title: 'Publicar',
            leftIcon: <Tag size={16} color={colors.gray[600]} />,
          }}
        />
      )}
    </VStack>
  )
}
