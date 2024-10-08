import React from "react";
import ModalDialog from "../ModalDialog"
import GenericInput from "../GenericInput";
import { Radio, RadioGroup, Select, SelectItem } from "@nextui-org/react";

type Props = { 
  isOpen: boolean,
  onOpenChange: () => void,
  autoLabelSamples?: (prefix: string, orderType: string) => void
}

enum OrderTypeOptions {
  BY_WINERY = "byWinery",
  BY_GRAPE = "byGrape",
  BY_GRAPE_COLOR = "byGrapeColor"
}

const colorOptions = {
  RED: { value: "red", label: "Red" },
  WHITE: { value: "white", label: "White" },
  ROSE: { value: "rose", label: "Rose" }
}

const additionalOrderOptions = {
  BY_RATING: { value: "byRating", label: "By Rating" },
  BY_YEAR: { value: "byYear", label: "By Year" }
};

const AutoLabelModal = ({ isOpen, onOpenChange, autoLabelSamples }: Props) => {
    // Auto labeling
    const [prefixValue, setPrefixValue] = React.useState<string>("");
    const [orderType, setOrderType] = React.useState<string>(OrderTypeOptions.BY_WINERY);

  return (
    <ModalDialog
      header="Auto Labeling"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onConfirm={autoLabelSamples 
        ? () => autoLabelSamples(prefixValue, orderType) 
        : () => {}
      }
      size="lg"
    >
      <GenericInput 
        label="Prefix"
        placeholder="None"
        value={prefixValue}
        onChange={setPrefixValue}
      />

      <RadioGroup
        label="Select labeling grouping method"
        orientation="horizontal"
        value={orderType}
        onValueChange={setOrderType}
        defaultValue={orderType}
      >
        <Radio value={OrderTypeOptions.BY_WINERY}>By Winery</Radio>
        <Radio value={OrderTypeOptions.BY_GRAPE}>By Grape</Radio>
        <Radio value={OrderTypeOptions.BY_GRAPE_COLOR}>By Grape Color</Radio>
      </RadioGroup>

      {orderType == OrderTypeOptions.BY_WINERY && (
        <Select 
          label="Select an animal"
          variant="bordered"
        >
          {Object.values(additionalOrderOptions).map((orderType) => (
            <SelectItem key={orderType.value}>
              {orderType.label}
            </SelectItem>
          ))}
        </Select>
      )}

      {orderType == OrderTypeOptions.BY_GRAPE_COLOR && (
        Object.values(colorOptions).map((color, index) => (
          <div className="flex flex-row items-center gap-4"> 
            <h3>{index + 1}.</h3>
            <Select 
              key={index}
              label="Select an color"
              variant="bordered"
              defaultSelectedKeys={[color.value]}
            >
              {Object.values(colorOptions).map((color) => (
                <SelectItem key={color.value}>
                  {color.label}
                </SelectItem>
              ))}
            </Select>
          </div>
        ))
      )}
    </ModalDialog>
  )
}

export default AutoLabelModal