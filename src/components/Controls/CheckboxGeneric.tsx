import { Checkbox } from "@nextui-org/react"

type Props = {
  children?: React.ReactNode,
  value: boolean,
  onChange: (value: boolean) => void,
  isRequired?: boolean,
  isInvalid?: boolean,
  errorMessage?: string,
  className?: string
}

const CheckboxGeneric = ({ children, value, onChange, isInvalid, isRequired, className }: Props) => {
  return (
    <Checkbox 
      isSelected={value}
      onValueChange={onChange}
      isRequired={isRequired}
      isInvalid={isInvalid}
      className={className}
    >
      {children}
    </Checkbox>
  )
}

export default CheckboxGeneric