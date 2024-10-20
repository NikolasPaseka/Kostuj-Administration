import { Input } from "@nextui-org/react";

type Props = {
  label: string,
  value: string,
  placeholder?: string,
  type?: "text" | "password",
  onChange: (value: string) => void,
  variant?: "flat" | "bordered" | "underlined" | "faded",
  labelPlacement?: "inside" | "outside"
}

const GenericInput = ({ label, value, onChange, variant="bordered", placeholder=undefined, labelPlacement="inside", type="text" }: Props) => {
  return (
    <Input 
      variant={variant}
      label={label}
      value={value}
      onValueChange={onChange}
      placeholder={placeholder}
      labelPlacement={labelPlacement}
      type={type}
      classNames={{
        inputWrapper: [
          "data-[hover=true]:border-tertiary",
          "data-[focus=true]:border-secondary",
          "after:bg-secondary",
          "group-data-[focus=true]:border-secondary",
        ]
      }}
    />
  )
}

export default GenericInput;