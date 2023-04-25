import { FormControl, Switch as SwitchNativeBase } from 'native-base'

type Props = {
  onToggle: () => void
  isChecked: boolean
  errorMessage?: string | null
}

export function Switch({ onToggle, isChecked, errorMessage }: Props) {
  return (
    <FormControl isInvalid={!!errorMessage} mt={3} mb={4}>
      <SwitchNativeBase
        onToggle={onToggle}
        isChecked={isChecked}
        onThumbColor="gray.700"
        offThumbColor="gray.700"
        onTrackColor="blue.300"
        offTrackColor="gray.500"
      />

      <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  )
}
