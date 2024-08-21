import { Input } from '@nextui-org/react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid';
import IconButton from './IconButton';

type Props = { 
  value: string,
  onValueChange: (newValue: string) => void
};

const SearchInput = ({ value, onValueChange }: Props) => {
  return (
    <Input 
      placeholder="Search"
      size="md"
      onValueChange={onValueChange}
      value={value}
      startContent={
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
      }
      endContent={
        <IconButton icon={<XMarkIcon/>} onClick={() => onValueChange("")} />
      }
      className="w-1/4 mx-4"
    />
  )
}

export default SearchInput