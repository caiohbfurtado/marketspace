import { Bank, Barcode, CreditCard, Money, QrCode } from 'phosphor-react-native'
import { PaymentMethodsKey } from '../dtos/ProductDTO'
import { HStack, Text, useTheme } from 'native-base'

const labelAndIconByMethod = {
  boleto: {
    label: 'Boleto',
    icon: Barcode,
  },
  pix: {
    label: 'Pix',
    icon: QrCode,
  },
  cash: {
    label: 'Dinheiro',
    icon: Money,
  },
  card: {
    label: 'Cartão de Crédito',
    icon: CreditCard,
  },
  deposit: {
    label: 'Depósito Bancário',
    icon: Bank,
  },
}

type Props = {
  method: PaymentMethodsKey
}

export function PaymentMethodsList({ method }: Props) {
  const { colors } = useTheme()
  const Icon = labelAndIconByMethod[method].icon

  return (
    <HStack alignItems="center" key={method}>
      <Icon color={colors.gray[100]} size={18} />
      <Text fontFamily="body" fontSize="sm" color="gray.200" ml={2}>
        {labelAndIconByMethod[method].label}
      </Text>
    </HStack>
  )
}
