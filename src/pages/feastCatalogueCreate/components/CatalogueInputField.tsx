import { Input } from '@nextui-org/react'

type Props = { 
  value?: string, 
  onValueChange?: (val: string) => void, 
  isRequired?: boolean; 
  isDisabled?: boolean;
  isReadOnly?: boolean;
  label: string; 
  placeholder: string; 
  type?: string; 
  StartContent?: React.ComponentType<{
    className?: string
  }> | null;  
};

const CatalogueInputField = ({ value, onValueChange, isRequired = false, isDisabled = false, isReadOnly = false, label, placeholder, type = "text", StartContent = null }: Props) => {
  return (
    <Input
      value={value}
      onValueChange={onValueChange}
      variant="faded"
      type={type}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      label={label}
      placeholder={placeholder}
      labelPlacement="outside"
      classNames={{
          inputWrapper: [
            "data-[hover=true]:border-secondary",
            "data-[focus=true]:border-secondary",
          ]
      }}
      startContent={StartContent ? <StartContent className="w-5 h-5 text-gray-600" /> : <></> }
    />
  )
}

export default CatalogueInputField