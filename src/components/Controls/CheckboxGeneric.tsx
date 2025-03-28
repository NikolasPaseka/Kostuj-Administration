import { Checkbox } from "@heroui/react"

type Props = {
  children?: React.ReactNode,
  value: boolean,
  onChange: (value: boolean) => void,
  isRequired?: boolean,
  isInvalid?: boolean,
  isDisabled?: boolean,
  errorMessage?: string,
  className?: string,
  color?: "primary" | "default" | "secondary" | "success" | "warning" | "danger"
}

const CheckboxGeneric = ({ children, value, onChange, isInvalid, isRequired, className, color="primary", isDisabled }: Props) => {
  return (
    <Checkbox 
      isSelected={value}
      onValueChange={onChange}
      isRequired={isRequired}
      isInvalid={isInvalid}
      className={className}
      color={color}
      isDisabled={isDisabled}
    >
      {children}
    </Checkbox>
  )
}

export default CheckboxGeneric