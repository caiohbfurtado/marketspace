import { Checkbox } from 'native-base'

type Option = {
  label: string
  value: string
}

type Props = {
  options: Option[]
  onChange: () => void
  value: string[]
}

export function TagRemovable({ options, onChange, value }: Props) {
  return (
    <Checkbox.Group flexDirection="row" value={value} onChange={onChange}>
      {options.map(({ value, label }) => (
        <Checkbox
          key={value}
          mr={2}
          backgroundColor="transparent"
          borderColor="transparent"
          value={value}
          _checked={{
            backgroundColor: 'trasparent',
            borderColor: 'transparent',
            _stack: {
              backgroundColor: 'blue.500',
            },
            _text: {
              color: 'white',
            },
          }}
          _icon={{
            display: 'none',
          }}
          _unchecked={{
            backgroundColor: 'trasparent',
            borderColor: 'transparent',
          }}
          _pressed={{
            backgroundColor: 'trasparent',
            borderColor: 'transparent',
          }}
          _stack={{
            backgroundColor: 'gray.500',
            borderRadius: 'full',
            h: 8,
            w: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          _text={{
            color: 'gray.300',
            fontFamily: 'heading',
            position: 'absolute',
          }}
          mb={2}
        >
          {label}
        </Checkbox>
      ))}
    </Checkbox.Group>
  )
}
