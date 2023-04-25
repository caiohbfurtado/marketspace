const AvailablePaymentMethods = [
  'boleto',
  'pix',
  'cash',
  'card',
  'deposit',
] as const
export type PaymentMethodsKey = typeof AvailablePaymentMethods[number]
type PaymentMethods = {
  key: PaymentMethodsKey
  name: string
}

type ProductImages = {
  id: string
  path: string
}

type UserAvatarProps = {
  avatar: string
}

export type ProductDTO = {
  accept_trade: boolean
  user: UserAvatarProps
  id: string
  is_active: boolean
  is_new: boolean
  name: string
  description: string
  payment_methods: PaymentMethods[]
  price: number
  product_images: ProductImages[]
}
