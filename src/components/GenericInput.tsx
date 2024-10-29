import { Input } from "@nextui-org/react";

type Props = {
  label?: string,
  value: string,
  placeholder?: string,
  type?: "text" | "password" | "number",
  onChange: (value: string) => void,
  variant?: "flat" | "bordered" | "underlined" | "faded",
  labelPlacement?: "inside" | "outside"
  className?: string
}

const GenericInput = ({ label, value, onChange, variant="bordered", placeholder=undefined, labelPlacement="inside", type="text", className }: Props) => {
  return (
    <Input 
      variant={variant}
      label={label}
      value={value}
      onValueChange={onChange}
      placeholder={placeholder}
      labelPlacement={labelPlacement}
      type={type}
      className={className}
      classNames={{
        inputWrapper: [
          "data-[hover=true]:border-tertiary",
          "data-[focus=true]:border-tertiary",
          "after:bg-tertiary",
          "group-data-[focus=true]:border-tertiary",
        ]
      }}
    />
  )
}

export default GenericInput;