import { useParams } from "react-router-dom";
import { resolveUiState, UiState, UiStateType } from "../../communication/UiState";
import { useEffect, useState } from "react";
import { CommunicationResult, isSuccess } from "../../communication/CommunicationsResult";
import { WineSample } from "../../model/WineSample";
import WineTable from "../../components/Tables/WineTable/WineTable";
import { CatalogueRepository } from "../../communication/repositories/CatalogueRepository";
import { SuccessMessage } from "../../model/ResponseObjects/SuccessMessage";
import { ExcelExporter } from "../../utils/ExcelExporter";
import { Catalogue } from "../../model/Catalogue";
import { WineSampleExport } from "../../model/ExportType/WineSampleExport";
import { Wine, WineUtil } from "../../model/Wine";

const FeastCatalogueWineContentPage = () => {
  const { id } = useParams();

  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING });
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [samples, setSamples] = useState<WineSample[]>([]);

  useEffect(() => {
    const fetchCatalogueSamples = async () => {
      if (id == null) { return }
      const res: CommunicationResult<WineSample[]> = await CatalogueRepository.getSamples(id);
      setSamples(resolveUiState(res, setUiState) ?? []);
    }

    const fetchCatalogueDetail = async () => {
      if (id == null) { return }
      const res: CommunicationResult<Catalogue> = await CatalogueRepository.getCatalogueDetail(id);
      if (isSuccess(res)) { setCatalogue(res.data); } 
    }

    fetchCatalogueSamples();
    fetchCatalogueDetail();
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

  const updateSamples = async (updatedSamples: WineSample[]) => {
    setUiState({ type: UiStateType.LOADING });
    const res = await CatalogueRepository.updateSamples(updatedSamples);
    if (isSuccess(res)) {
      setUiState({ type: UiStateType.SUCCESS });
      setSamples((prevSamples) => {
        return prevSamples.map(sample => {
          const updatedSample = updatedSamples.find(s => s.id === sample.id);
          if (updatedSample) { console.log(updatedSample); }
          return updatedSample ?? sample;
        });
      });
    } else {
      setUiState({ type: UiStateType.ERROR, message: res.message });
    }
  }

  const exportToExcel = async (samples: WineSample[], seperateByCategory?: boolean, category?: keyof WineSampleExport) => {
    const fileName = `${catalogue?.title ?? "catalogue"}-samples`;

    if (seperateByCategory && category) {
      return ExcelExporter.exportToExcelByCategory(samples.map(sample => {
        return new WineSampleExport(sample);
      }), fileName, category);

    } else {
      return ExcelExporter.exportToExcel(samples.map(sample => {
        const wine = sample.wineId as Wine;
        wine.resultSweetness = WineUtil.getResultSweetnessLabel(wine);
        return new WineSampleExport(sample);
      }), fileName);
    }
  }

  return (
    <>
      <WineTable 
        wineSamples={samples} 
        uiState={uiState}
        deleteWineSample={deleteWineSample}
        autoLabelSamples={autoLabelSamples}
        updateSamples={updateSamples}
        exportToExcel={exportToExcel}
      />
    </>
  )
}

export default FeastCatalogueWineContentPage