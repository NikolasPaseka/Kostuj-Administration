import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { CalendarDaysIcon } from '@heroicons/react/24/solid'
import { parseAbsoluteToLocal } from '@internationalized/date'
import { DatePicker } from '@nextui-org/react'
import { I18nProvider } from '@react-aria/i18n'

type Props = {
  value: Date | null,
  onChange: (date: Date) => void
  label: string
}

const DatePickerGeneric = ({ value, onChange, label }: Props) => {

  const dateForInput = value != null ? parseAbsoluteToLocal(value.toISOString()) : null;
  
  return (
    <I18nProvider locale="cs-CZ">
      <DatePicker 
        hideTimeZone
        value={dateForInput} 
        onChange={(date) => onChange(new Date(date.toAbsoluteString()))} 
        variant="faded" 
        isRequired 
        label={label}
        labelPlacement="outside"
        startContent={<CalendarDaysIcon className="w-5 h-5 text-gray-600" />}
        selectorIcon={<ChevronDownIcon className="w-3 h-3 text-gray-600" />}
        dateInputClassNames={{
          inputWrapper: [
            "hover:border-tertiary",
          ]
      }}
      />
   </I18nProvider>
  )
}

export default DatePickerGeneric