import { Checkbox as CheckboxNativeBase, FormControl } from 'native-base'

type Option = {
  label: string
  value: string
}

type Props = {
  options: Option[]
  onChange: (isSelected: boolean) => void
  errorMessage?: string | null
  value: string[]
}
export function Checkbox({ options, onChange, value, errorMessage }: Props) {
  return (
    <FormControl isInvalid={!!errorMessage} mb={8} mt={3}>
      <CheckboxNativeBase.Group
        accessibilityLabel="Escolha os meios de pagamento válidos"
        onChange={onChange}
        value={value ?? []}
      >
        {options.map(({ label, value }) => (
          <CheckboxNativeBase
            key={value}
            value={value}
            _checked={{
              backgroundColor: 'blue.300',
              borderColor: 'blue.300',
            }}
            mb={2}
          >
            {label}
          </CheckboxNativeBase>
        ))}
      </CheckboxNativeBase.Group>

      <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
