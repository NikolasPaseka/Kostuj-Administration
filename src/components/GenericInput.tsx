import { Input } from "@nextui-org/react";

type Props = {
  label: string,
  value: string,
  placeholder?: string,
  onChange: (value: string) => void,
  variant?: "flat" | "bordered" | "underlined" | "faded",
  labelPlacement?: "inside" | "outside"
}

const GenericInput = ({ label, value, onChange, variant="bordered", placeholder=undefined, labelPlacement="inside" }: Props) => {
  return (
    <Input 
      variant={variant}
      label={label}
      value={value}
      onValueChange={onChange}
      placeholder={placeholder}
      labelPlacement={labelPlacement}
      classNames={{
        inputWrapper: [
          "data-[hover=true]:border-secondary",
          "data-[focus=true]:border-secondary",
          "after:bg-secondary",
          "group-data-[focus=true]:border-secondary",
        ]
      }}
    />
  )
}

export default GenericInput;