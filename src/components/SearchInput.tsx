import { Input } from '@nextui-org/react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid';
import IconButton from './IconButton';
import { useTranslation } from 'react-i18next';
import { TranslationNS } from '../translations/i18n';

type Props = { 
  value: string,
  onValueChange: (newValue: string) => void
  className?: string;
};

const SearchInput = ({ value, onValueChange, className }: Props) => {
  const { t } = useTranslation();

  return (
    <Input 
      placeholder={`${t("search", { ns: TranslationNS.common })}`}
      size="md"
      onValueChange={onValueChange}
      value={value}
      startContent={
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
      }
      endContent={
        <IconButton icon={<XMarkIcon/>} onClick={() => onValueChange("")} />
      }
      className={`w-1/4 ${className}`}
      // classNames={{
      //   inputWrapper: [
      //     "data-[hover=true]:border-secondary",
      //     "data-[focus=true]:border-secondary",
      //   ]
      // }}
    />
  )
}

export default SearchInput