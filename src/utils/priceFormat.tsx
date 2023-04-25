export function priceFormat(price: number) {
  return (price / 100).toLocaleString('pt-br', { minimumFractionDigits: 2 })
}
