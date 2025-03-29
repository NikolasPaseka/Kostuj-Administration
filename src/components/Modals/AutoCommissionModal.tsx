import React from 'react';
import ModalDialog from '../ModalDialog'
import { isStateError, isStateLoading, isStateSuccess, resolveUiState, UiState, UiStateType } from '../../communication/UiState';
import { CircularProgress } from '@heroui/react';
import GenericInput from '../GenericInput';
import StateMessage from '../StateMessage';
import { useParams } from 'react-router-dom';
import { CatalogueRepository } from '../../communication/repositories/CatalogueRepository';

type Props = { 
  isOpen: boolean,
  onOpenChange: () => void
}

const AutoCommissionModal = ({ isOpen, onOpenChange }: Props) => {
  const { id: catalogueId } = useParams<{ id: string }>();

  const [uiState, setUiState] = React.useState<UiState>({ type: UiStateType.IDLE });

  const [redWineCommissions, setRedWineCommissions] = React.useState<number>(0);
  const [whiteWineCommissions, setWhiteWineCommissions] = React.useState<number>(0);
  const [roseWineCommissions, setRoseWineCommissions] = React.useState<number>(0);

  const handleAutoAssign = async () => {
    setUiState({ type: UiStateType.LOADING });
    const res = await CatalogueRepository.autoAssignCommission(catalogueId ?? "", {
      red: redWineCommissions,
      white: whiteWineCommissions,
      rose: roseWineCommissions,
      other: 0
    });
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
        <p>Vyberte počet komisí pro danou barvu vína</p>
        <div className='flex flex-row gap-2 items-center'>
          <p className="text-sm text-gray-500">1.</p>
          <GenericInput 
            label={"Červené"}
            type='number'
            value={redWineCommissions.toString()}
            onChange={(val) => setRedWineCommissions(Number(val))}
            startContent={<div className="w-3 h-3 bg-redWineColor rounded-full" />}
            customStartContent={true}
          />
        </div>

        <div className='flex flex-row gap-2 items-center'>
          <p className="text-sm text-gray-500">2.</p>
          <GenericInput 
            label={"Bílé"}
            type='number'
            value={whiteWineCommissions.toString()}
            onChange={(val) => setWhiteWineCommissions(Number(val))}
            startContent={<div className="w-3 h-3 bg-whiteWineColor rounded-full" />}
            customStartContent={true}
          />
        </div>

        <div className='flex flex-row gap-2 items-center'>
          <p className="text-sm text-gray-500">3.</p>
          <GenericInput 
            label={"Růžové"}
            type='number'
            value={roseWineCommissions.toString()}
            onChange={(val) => setRoseWineCommissions(Number(val))}
            startContent={<div className="w-3 h-3 bg-roseWineColor rounded-full" />}
            customStartContent={true}
          />
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