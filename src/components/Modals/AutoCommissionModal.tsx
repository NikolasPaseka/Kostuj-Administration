import React from 'react';
import ModalDialog from '../ModalDialog'
import { isStateError, isStateLoading, isStateSuccess, resolveUiState, UiState, UiStateType } from '../../communication/UiState';
import { CircularProgress, Radio, RadioGroup } from '@heroui/react';
import GenericInput from '../GenericInput';
import StateMessage from '../StateMessage';
import ClickableChip from '../Controls/ClickableChip';
import { useParams } from 'react-router-dom';
import { CatalogueRepository } from '../../communication/repositories/CatalogueRepository';

type Props = { 
  isOpen: boolean,
  onOpenChange: () => void
}

enum AssignTypeOptions {
  BY_COMMISSION_NUMBER = "byCommissionNumber",
  BY_SAMPLES_SIZE = "bySamplesSize"
}

const AutoCommissionModal = ({ isOpen, onOpenChange }: Props) => {

  const [uiState, setUiState] = React.useState<UiState>({ type: UiStateType.IDLE });

  const [orderType, setOrderType] = React.useState<string>(AssignTypeOptions.BY_COMMISSION_NUMBER);
  const [numberSize, setNumberSize] = React.useState<number>(0);

  // TODO: refactor selectedSorts to map
  const [byGrape, setByGrape] = React.useState<boolean>(false);
  const [byGrapeColor, setByGrapeColor] = React.useState<boolean>(false);
  const [byWinery, setByWinery] = React.useState<boolean>(false);
  const [byYear, setByYear] = React.useState<boolean>(false);

  const { id: catalogueId } = useParams<{ id: string }>();

  const handleAutoAssign = async () => {
    setUiState({ type: UiStateType.LOADING });
    const res = await CatalogueRepository.autoAssignCommission(catalogueId ?? "", 12);
    resolveUiState(res, setUiState);
  }

  return (
    <ModalDialog
      header="Auto Labeling"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onConfirm={() => handleAutoAssign()}
      onCloseAction={() => setUiState({ type: UiStateType.IDLE })}
      size="lg"
    >
      {isStateLoading(uiState) && <>
        <CircularProgress color="primary" className="m-auto" />
      </>}
      
      {!isStateLoading(uiState) && 
      <>
        <RadioGroup
          label="Select labeling grouping method"
          orientation="horizontal"
          value={orderType}
          onValueChange={setOrderType}
          defaultValue={orderType}
        >
          <Radio value={AssignTypeOptions.BY_COMMISSION_NUMBER}>By number of commissions</Radio>
          <Radio value={AssignTypeOptions.BY_SAMPLES_SIZE}>By wine samples size</Radio>
        </RadioGroup>

        <GenericInput 
          label={orderType === AssignTypeOptions.BY_COMMISSION_NUMBER ? "Number of commissions" : "Number of samples"}
          placeholder="None"
          value={numberSize.toString()}
          onChange={(val) => setNumberSize(Number(val))}
        />

        {/* TODO: Refactor selected sorts */}
        <p>Select parameters to sort the automatically assigning</p>
        <div className='flex flex-row gap-2'>
          <ClickableChip 
            isActive={byGrape}
            onClick={() => setByGrape(!byGrape)}
            color='primary'
          >
            Grape
          </ClickableChip>

          <ClickableChip 
            isActive={byGrapeColor}
            onClick={() => setByGrapeColor(!byGrapeColor)}
          >
            Grape Color
          </ClickableChip>

          <ClickableChip 
            isActive={byWinery}
            onClick={() => setByWinery(!byWinery)}
          >
            Winery
          </ClickableChip>

          <ClickableChip 
            isActive={byYear}
            onClick={() => setByYear(!byYear)}
          >
            Year
          </ClickableChip>
        </div>

        {isStateSuccess(uiState) && 
          <StateMessage 
            stateMessageType="success"
            text={<p>Samples <b>successfully</b> assigned to commissions</p>}
          />
        }

        {isStateError(uiState) &&
          <StateMessage
            stateMessageType="error"
            text={<p>{uiState.message}</p>}
          />
        }
      </>
    }
    </ModalDialog>
  )
}

export default AutoCommissionModal