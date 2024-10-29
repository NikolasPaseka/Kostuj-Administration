import { isStateError, isStateLoading, UiState } from '../communication/UiState';
import { Spinner } from '@nextui-org/react';
import StateMessage from './StateMessage';

type Props = { uiState: UiState };

const UiStateHandler = ({ uiState }: Props) => {
  return (
    <>
      {isStateLoading(uiState) && <Spinner color="primary" />}
      {isStateError(uiState) && 
        <StateMessage stateMessageType="error" text={<p>Error: {uiState.message}</p>} />
      }
    </>
  )
}

export default UiStateHandler