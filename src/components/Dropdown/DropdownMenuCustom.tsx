import { DropdownActionItem } from './DropdownActionItems';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import { Key } from 'react';

type Props = {
  dropdownButtonText: string,
  actionItems: DropdownActionItem[]
}

const DropdownMenuCustom = ({ dropdownButtonText, actionItems }: Props) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          color="primary"
          endContent={<ChevronDownIcon className="w-4 h-4" />}
        >
          {dropdownButtonText}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Dynamic Actions" 
        items={actionItems}
        onAction={(key: Key) => {
          const actionItem = actionItems.find(item => item.key === key);
          if (actionItem && actionItem.onClick) {
            actionItem.onClick();
          }
        }}
      >
        {(item) => (
          <DropdownItem
            key={item.key}
            startContent={item.startContent}
            description={item.description}
          >
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}

export default DropdownMenuCustom;