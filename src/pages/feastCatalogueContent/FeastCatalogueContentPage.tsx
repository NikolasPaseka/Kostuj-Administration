import { useParams } from "react-router-dom";
import { resolveUiState, UiState, UiStateType } from "../../communication/UiState";
import { useEffect, useState } from "react";
import { CommunicationResult, isSuccess } from "../../communication/CommunicationsResult";
import { WineSample } from "../../model/WineSample";
import WineTable from "../../components/Tables/WineTable";
import { CatalogueRepository } from "../../communication/repositories/CatalogueRepository";
import { SuccessMessage } from "../../model/ResponseObjects/SuccessMessage";

const FeastCatalogueContentPage = () => {
  const { id } = useParams();

  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });
  const [samples, setSamples] = useState<WineSample[]>([]);

  useEffect(() => {
    const fetchCatalogueSamples = async () => {
      if (id == null) { return }
      const res: CommunicationResult<WineSample[]> = await CatalogueRepository.getSamples(id);
      setSamples(resolveUiState(res, setUiState) ?? []);
    }

    fetchCatalogueSamples();
  }, [id]);

  const deleteWineSample = async (sample: WineSample) => {
    const res: CommunicationResult<SuccessMessage> = await CatalogueRepository.deleteSample(sample); 
    console.log(res);
    if (isSuccess(res)) {
      setSamples([...samples.filter(s => s.id !== sample.id)]);
    }
  }

  const autoLabelSamples = async (prefix: string, orderType: string, colorOrder: string[]) => {
    if (id == null) { return }
    const res = await CatalogueRepository.autoLabelSamples(id, prefix, orderType, colorOrder);
    setSamples(resolveUiState(res, setUiState) ?? []);
  }

  return (
    <>
      <WineTable 
        wineSamples={samples} 
        uiState={uiState}
        deleteWineSample={deleteWineSample}
        autoLabelSamples={autoLabelSamples}
      />
    </>
  )
}

export default FeastCatalogueContentPage