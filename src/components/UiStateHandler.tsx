import { isStateError, isStateLoading, UiState } from '../communication/UiState';
import { Spinner } from '@nextui-org/react';

type Props = { uiState: UiState };

const UiStateHandler = ({ uiState }: Props) => {
  return (
    <>
      {isStateLoading(uiState) && <Spinner color="primary" />}
      {isStateError(uiState) && <p>Error: {uiState.message}</p>}
    </>
  )
}

export default UiStateHandler