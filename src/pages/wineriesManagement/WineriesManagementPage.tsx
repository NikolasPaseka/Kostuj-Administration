import { ChevronDownIcon } from '@heroicons/react/16/solid'
import WineryTable from '../../components/Tables/WineryTable/WineryTable'
import { Winery } from '../../model/Winery'
import { useEffect, useState } from 'react'
import { resolveUiState, UiState, UiStateType } from '../../communication/UiState'
import { WineryRepository } from '../../communication/repositories/WineryRepository'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from '@nextui-org/react'
import CreateWineryModal from '../../components/Modals/CreateWineryModal'
import { isSuccess } from '../../communication/CommunicationsResult'
import { ArrowUpOnSquareIcon, PlusIcon } from '@heroicons/react/24/solid'
import ImportDataModal from '../feastCatalogueDetail/components/ImportDataModal'

const WineriesManagementPage = () => {

  const [adminWineries, setAdminWineries] = useState<Winery[]>([])
  const [uiState, setUiState] = useState<UiState>({ type: UiStateType.LOADING })

  const {isOpen: isNewWineryOpen, onOpen: onNewWineryOpen, onOpenChange: onNewWineryOpenChange} = useDisclosure();
  const {isOpen: isImportWineriesOpen, onOpen: onImportWineriesOpen, onOpenChange: onImportWineriesOpenChange} = useDisclosure();

  const fetchAdminWineries = async () => {
    const res = await WineryRepository.getAdminsWineries();
    const wineries = resolveUiState(res, setUiState)
    setAdminWineries(wineries ?? [])
  }

  const deleteWinery = async (winery: Winery) => {
    const res = await WineryRepository.deleteWinery(winery)
    if (isSuccess(res)) {
      console.log(res.data)
      setAdminWineries(adminWineries.filter(w => w.id !== winery.id))
    }
  }

  const updateWineryState = async (winery: Winery) => {
    setAdminWineries(adminWineries.map(w => w.id === winery.id ? winery : w))
  }

  useEffect(() => {
    fetchAdminWineries()
  }, [])

  return (
    <div>
    <WineryTable
      wineries={adminWineries}
      uiState={uiState}
      deleteWinery={deleteWinery}
      updateWinery={updateWineryState}
      tableActions={
        <Dropdown>
          <DropdownTrigger>
            <Button
              color="primary"
              endContent={<ChevronDownIcon className="w-4 h-4" />}
            >
              Add
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Dynamic Actions" 
          >
              <DropdownItem
                startContent={<PlusIcon className="w-5 h-5 text-secondary" />}
                description={"Create new winery"}
                onClick={onNewWineryOpen}
              >
                New winery
              </DropdownItem>

              <DropdownItem
                startContent={<ArrowUpOnSquareIcon className="w-5 h-5 text-secondary" />}
                description={"Import wineries from excel file"}
                onClick={onImportWineriesOpen}
              >
                Import wineries
              </DropdownItem>

          </DropdownMenu>
        </Dropdown>
      }
    />

    <CreateWineryModal
      isOpen={isNewWineryOpen}
      onOpenChange={onNewWineryOpenChange}
      onWineryCreateOrEdit={(winery: Winery) => {
        setAdminWineries([...adminWineries, winery])
      }}
    />

    <ImportDataModal
      isOpen={isImportWineriesOpen}
      onOpenChange={onImportWineriesOpenChange}
      importOnlyWineries={true}
      onImportedDataLoaded={(data) => {
        setAdminWineries([...adminWineries, ...data.wineries])
      }}
    />
    </div>
  )
}

export default WineriesManagementPage