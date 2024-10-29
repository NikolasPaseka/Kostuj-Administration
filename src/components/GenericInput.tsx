import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Input } from "@nextui-org/react";
import React from "react";

type Props = {
  label?: string,
  value: string,
  placeholder?: string,
  type?: "text" | "password" | "number",
  onChange: (value: string) => void,
  variant?: "flat" | "bordered" | "underlined" | "faded",
  labelPlacement?: "inside" | "outside",
  startContent?: React.ReactNode,
  validate?: (message: string) => void
  className?: string
}

const GenericInput = ({ label, value, onChange, variant="bordered", placeholder=undefined, labelPlacement="inside", type="text", startContent, validate, className }: Props) => {

  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input 
      variant={variant}
      label={label}
      value={value}
      onValueChange={onChange}
      placeholder={placeholder}
      labelPlacement={labelPlacement}
      type={(type === "password" && isVisible) ? "text" : type}
      //validate={}
      startContent={startContent && React.cloneElement(startContent as React.ReactElement, { className: `w-5 h-5 text-gray-600`})}
      endContent={
        type === "password" 
        ?
          <button onClick={toggleVisibility}>
            {isVisible ? (
                <EyeSlashIcon className="w-5 h-5 text-gray-600" />
              ) : (
                <EyeIcon className="w-5 h-5 text-gray-600" />
              )
            }
          </button>
        : undefined
      }
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