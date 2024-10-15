import FileUploader from '../../../components/FileUploader'
import ModalDialog from '../../../components/ModalDialog'
import { useState } from 'react'
import { CatalogueImport } from '../../../model/ImportType/CatalogueImport'
import { Tab, Tabs } from '@nextui-org/react'
import { Winery } from '../../../model/Winery'
import { CatalogueImportUtil } from '../../../utils/CatalogueImportUtils'
import { WineSample } from '../../../model/WineSample'
import { CatalogueRepository } from '../../../communication/repositories/CatalogueRepository'
import { isSuccess } from '../../../communication/CommunicationsResult'
import { useAuth } from '../../../context/AuthProvider'
import { Catalogue } from '../../../model/Catalogue'
import { isStateIdle, isStateLoading, isStateSuccess, UiState, UiStateType } from '../../../communication/UiState'

type Props = {
  isOpen: boolean,
  onOpenChange: () => void,
  catalogue: Catalogue
  onImportedDataLoaded: () => void
}

const ImportDataModal = ({ isOpen, onOpenChange, catalogue, onImportedDataLoaded }: Props) => {
  const [importUiState, setImportUiState] = useState<UiState>({ type: UiStateType.IDLE });

  const [importedData, setImportedData] = useState<CatalogueImport | null>(null)
  const [importedWineries, setImportedWineries] = useState<Winery[]>([])
  const [importedSamples, setImportedSamples] = useState<WineSample[]>([])
  const [tabSelection, setTabSelection] = useState<"wineries" | "samples">("wineries");

  const { getUserData } = useAuth(); 

  const sendImportedData = async () => {
    setImportUiState({ type: UiStateType.LOADING });
    const res = await CatalogueRepository.importContentData(catalogue, { wineries: importedWineries, samples: importedSamples });
    if (isSuccess(res)) {
      // TODO: Show snackbar
      onImportedDataLoaded();
      setImportUiState({ type: UiStateType.SUCCESS });
    }
    console.log(res);
  }

  return (
    <div>
      <ModalDialog
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="3xl"
        header={"Import Data"}
        onConfirm={sendImportedData}
        scrollBehavior="inside"
      >
        <div className="sticky top-0 bg-white z-10">
        <FileUploader onDataImport={(data) => {
          const importUtil = new CatalogueImportUtil(data);
      
          setImportedData(data);
          setImportedWineries(importUtil.getWineries(getUserData()?.id ?? ""));
          setImportedSamples(importUtil.getSamples(catalogue.id));
        }}/>
        </div>
        
        {isStateLoading(importUiState) && <div>Loading...</div>}

        {isStateIdle(importUiState) && importedData && 
          <Tabs
            selectedKey={tabSelection}
            onSelectionChange={(key) => setTabSelection(key as "wineries" | "samples")}
            color="secondary" 
            variant="solid" 
            aria-label="Group Options"
          >
            <Tab key="wineries" title="Wineries">
              {importedWineries.map((item, index) => (
                <div key={index} className="border-b border-gray-200">
                  {item.name}
                </div>
              ))}
            </Tab>
            <Tab key="samples" title="Samples">
              {importedSamples.map((item, index) => (
                <div key={index} className="border-b border-gray-200">
                  {item.name}
                </div>
              ))}
            </Tab>
          </Tabs>
        }

        {isStateSuccess(importUiState) && <div>Imported successfully</div>}

      </ModalDialog>
    </div>
  )
}

export default ImportDataModal