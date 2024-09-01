import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { UiState, UiStateType } from "../../communication/UiState";
import { useEffect, useState } from "react";
import { CommunicationResult, isSuccess } from "../../communication/CommunicationsResult";
import { WineSample } from "../../model/WineSample";
import { axiosCall } from "../../communication/axios";
import WineTable from "../../components/Tables/WineTable";

const FeastCatalogueContentPage = () => {
  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });
  const [samples, setSamples] = useState<WineSample[]>([]);
  const { id } = useParams();
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchCatalogueSamples = async () => {
      const res: CommunicationResult<WineSample[]> = await axiosCall(`/catalogues/${id}/samples`, "GET", undefined, accessToken ?? undefined);
      if (isSuccess(res)) {
        setUiState({ type: UiStateType.SUCCESS })
        setSamples(res.data);
      } else {
        setUiState({ 
          type: UiStateType.ERROR,
          message: res.message
        })
      }
    }
    fetchCatalogueSamples();
  }, [accessToken, id]);


  return (
    <WineTable wineSamples={samples} uiState={uiState} />
  )
}

export default FeastCatalogueContentPage