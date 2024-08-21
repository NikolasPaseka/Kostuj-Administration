import { useEffect, useState } from 'react'
import {Button} from "@nextui-org/react";
import { axiosCall } from '../../communication/axios';
import { Catalogue } from '../../model/Catalogue';
import { CommunicationResult, isSuccess } from '../../communication/CommunicationsResult';
import { isStateSuccess, UiState, UiStateType } from '../../communication/UiState';
import UiStateHandler from '../../components/UiStateHandler';

const HomePage = () => {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING })

  useEffect(() => {
    const fetchCatalogues = async () => {
      const result: CommunicationResult<Catalogue[]> = await axiosCall('/catalogues?page=1&limit=10', 'GET');

      if (isSuccess(result)) {
        setUiState({ type: UiStateType.SUCCESS })
        setCatalogues(result.data);
      } else {
        setUiState({ 
          type: UiStateType.ERROR,
          message: result.message
        })
      }
    }

    fetchCatalogues();
  }, [])


  return (
    <>
      <Button color='primary'>Click Me</Button>
      <h1 className="text-6xl font-bold">Kostuj Administration</h1>
      <div>
        <UiStateHandler uiState={uiState} />
        {isStateSuccess(uiState) && catalogues.map((catalogue: Catalogue) => (
          <div key={catalogue.id}>
            <h2>{catalogue.title}</h2>
            <p>{catalogue.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default HomePage