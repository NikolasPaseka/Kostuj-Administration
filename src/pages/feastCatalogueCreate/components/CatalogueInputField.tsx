import { Input } from '@nextui-org/react'
import { forwardRef } from 'react';

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
  description?: string | React.ReactNode;
  className?: string
};

const CatalogueInputField = forwardRef<HTMLInputElement, Props>(({ value, onValueChange, isRequired = false, isDisabled = false, isReadOnly = false, label, placeholder, type = "text", StartContent = null, description, className }: Props, ref) => {
  return (
    <Input
      ref={ref}
      value={value}
      onValueChange={onValueChange}
      variant="faded"
      type={type}
      isRequired={isRequired}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      label={label}
      placeholder={placeholder}
      labelPlacement="inside"
      className={className}
      classNames={{
          inputWrapper: [
            "data-[focus=true]:border-tertiary",
            "data-[hover=true]:border-tertiary",
          ]
      }}
      startContent={StartContent ? <StartContent className="w-5 h-5 text-gray-600" /> : <></> }
      description={description}
    />
  )
});

export default CatalogueInputField