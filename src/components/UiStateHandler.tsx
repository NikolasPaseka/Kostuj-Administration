import React from 'react'
import { isStateError, isStateLoading, UiState } from '../communication/UiState';

type Props = { uiState: UiState };

const UiStateHandler = ({ uiState }: Props) => {
  return (
    <>
      {isStateLoading(uiState) && <p>Loading...</p>}
      {isStateError(uiState) && <p>Error: {uiState.message}</p>}
    </>
  )
}

export default UiStateHandler