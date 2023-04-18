import { FormControl, Radio as RadioNativeBase, VStack } from 'native-base'

type Option = {
  label: string
  value: string
}

type Props = {
  options: Option[]
  onChange: () => void
  errorMessage?: string | null
}

export function Radio({ onChange, errorMessage, options }: Props) {
  return (
    <FormControl isInvalid={!!errorMessage} mb={8}>
      <RadioNativeBase.Group
        name="isNew"
        accessibilityLabel="Tipo do produto"
        direction="row"
        onChange={onChange}
      >
        {options.map(({ label, value }) => (
          <VStack key={value} mr={4}>
            <RadioNativeBase
              value={value}
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
              {label}
            </RadioNativeBase>
          </VStack>
        ))}
      </RadioNativeBase.Group>

      <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
