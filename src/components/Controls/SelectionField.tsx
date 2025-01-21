import { Select, SelectItem } from "@heroui/react";
import React from "react";

type Props = {
  label: string,
  defaultSelectedKeys: string[],
  selectedKeys?: string[],
  onSelectionChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  items: { value: string, label: string, startContent?: React.ReactNode }[]
  variant?: "bordered" | "flat" | "faded"
}

const SelectionField = ({ label, defaultSelectedKeys, onSelectionChange, items, variant="bordered", selectedKeys=[]}: Props) => {
  
  const [selectedItem, setSelectedItem] = React.useState(items.find((item) => item.value === defaultSelectedKeys[0]));

  return (
    <Select 
      label={label}
      variant={variant}
      placeholder="Vyberte možnost"
      defaultSelectedKeys={defaultSelectedKeys}
      selectedKeys={selectedKeys}
      value={selectedItem?.value}
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