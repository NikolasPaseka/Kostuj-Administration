import { resolveUiState, UiState, UiStateType } from "../../communication/UiState";
import { useEffect, useState } from "react";
import { CommunicationResult, isSuccess } from "../../communication/CommunicationsResult";
import { CatalogueRepository } from "../../communication/repositories/CatalogueRepository";
import { SuccessMessage } from "../../model/ResponseObjects/SuccessMessage";
import { Winery } from "../../model/Winery";
import WineryTable from "../../components/Tables/WineryTable/WineryTable";
import { useParams } from "react-router-dom";

const FeastCatalogueWineriesContentPage = () => {

  const { id } = useParams();

  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });
  const [wineries, setWineries] = useState<Winery[]>([]);

  useEffect(() => {
    const fetchParticipatedWineries = async () => {
      const res: CommunicationResult<Winery[]> = await CatalogueRepository.getParticipatedWineries(id ?? "");
      setWineries(resolveUiState(res, setUiState) ?? []);
    }

    fetchParticipatedWineries();
  }, [id]);

  const removeWineryFromParticipated = async (winery: Winery) => {
    const res: CommunicationResult<SuccessMessage> = await CatalogueRepository.removeWineryFromParticipated(id ?? "", winery);
    if (isSuccess(res)) {
      setWineries([...wineries.filter(w => w.id !== winery.id)]);
    }
  }

  return (
    <>
      <WineryTable 
        wineries={wineries}
        uiState={uiState}
        removeWineryFromParticipated={removeWineryFromParticipated}
      />
    </>
  )
}

export default FeastCatalogueWineriesContentPage