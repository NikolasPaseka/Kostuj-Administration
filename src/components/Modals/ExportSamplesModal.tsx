import { useState } from 'react'
import CheckboxGeneric from '../Controls/CheckboxGeneric'
import ModalDialog from '../ModalDialog'
import { Radio, RadioGroup } from "@heroui/react"
import { WineSampleExport } from '../../model/ExportType/WineSampleExport'

type Props = {
  isOpen: boolean,
  onOpenChange: () => void,
  onConfirm: (onlyFilteredSamples: boolean, seperateByCategory?: boolean, category?: keyof WineSampleExport) => void
}

const ExportSamplesModal = ({ isOpen, onOpenChange, onConfirm }: Props) => {

  const [onlyFilteredSamples, setOnlyFilteredSamples] = useState(true);
  const [exportByCategory, setExportByCategory] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<keyof WineSampleExport>("ratingCommission");

  return (
    <div>
      <ModalDialog 
        isOpen={isOpen} 
        onOpenChange={onOpenChange} 
        onConfirm={() => onConfirm(onlyFilteredSamples, exportByCategory, selectedCategory)} 
        header="Export samples to Excel File"
        confirmText="Export"
        size="lg"
      >
        <CheckboxGeneric 
          value={onlyFilteredSamples} 
          onChange={setOnlyFilteredSamples} 
          isRequired={true}
        >
          Include only filtered samples
        </CheckboxGeneric>

        <CheckboxGeneric 
          value={exportByCategory} 
          onChange={setExportByCategory} 
          isRequired={true}
        >
          Seperate samples to sheets by category
        </CheckboxGeneric>

        {exportByCategory && (
          <RadioGroup
            label="Select category"
            value={selectedCategory}
            onValueChange={(value) => setSelectedCategory(value as keyof WineSampleExport)}
            orientation="horizontal"
          >  
            <Radio value="ratingCommission">Rating Commission</Radio>
            <Radio value="color">Wine Color</Radio>
          </RadioGroup>
        )}

      </ModalDialog>
    </div>
  )
}

export default ExportSamplesModal