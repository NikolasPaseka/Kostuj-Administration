import { Select, SelectItem } from "@nextui-org/react";
import React from "react";

type Props = {
  key: number,
  label: string,
  defaultSelectedKeys: string[],
  onSelectionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  items: { value: string, label: string, startContent?: React.ReactNode }[]
}

const SelectionField = ({ key, label, defaultSelectedKeys, onSelectionChange, items}: Props) => {
  
  const [selectedItem, setSelectedItem] = React.useState(items.find((item) => item.value === defaultSelectedKeys[0]));

  return (
    <Select 
      key={key}
      label={label}
      variant="bordered"
      defaultSelectedKeys={defaultSelectedKeys}
      onChange={(e) => {
        setSelectedItem(items.find((item) => item.value === e.target.value));
        onSelectionChange(e)
      }}
      classNames={{
        trigger: [
          "data-[open=true]:border-secondary",
          "data-[hover=true]:border-tertiary",
          "data-[focus=true]:border-secondary",
          "after:bg-secondary",
          "group-data-[focus=true]:border-secondary",
        ]
      }}
      startContent={selectedItem?.startContent}
    >
      {Object.values(items).map((item) => (
        <SelectItem 
          key={item.value}
          startContent={item.startContent}
        >
          {item.label}
        </SelectItem>
      ))}
    </Select>
  );
}

export default SelectionField;