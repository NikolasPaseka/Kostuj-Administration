import React, { useEffect } from 'react'
import SearchInput from '../../SearchInput';
import { Spacer, useDisclosure } from '@nextui-org/react';
import { UiState } from '../../../communication/UiState';
import { Winery } from '../../../model/Winery';
import GenericTable from '../GenericTable';
import ModalDialog from '../../ModalDialog';
import CreateWineryModal from '../../Modals/CreateWineryModal';
import useWineryTableRender from './useWineryTableRender';


type Props = { 
  wineries: Winery[], 
  uiState: UiState,
  removeWineryFromParticipated?: (winery: Winery) => Promise<void>
  deleteWinery?: (winery: Winery) => Promise<void>
  updateWinery?: (winery: Winery) => Promise<void>
  tableActions?: React.ReactNode
  isSelectable?: boolean
  onSelectionChange?: (wineries: Winery[]) => void
  selectedWineries?: Winery[]
};

const WineryTable = ({ wineries, uiState, removeWineryFromParticipated, deleteWinery, updateWinery, tableActions, isSelectable=false, onSelectionChange, selectedWineries }: Props) => {
  
  const {isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose} = useDisclosure();
  const {isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange} = useDisclosure();

  const [searchValue, setSearchValue] = React.useState<string>(""); 
  const [wineryToRemove, setWineryToRemove] = React.useState<Winery | null>(null);
  const [wineryToEdit, setWineryToEdit] = React.useState<Winery | null>(null);
  
  useEffect(() => {
    if (wineryToEdit) {
      onEditOpen();
    }
  }, [onEditOpen, wineryToEdit]);

  const { renderCell, tableColumns } = useWineryTableRender({ setWineryToEdit, setWineryToRemove, onDeleteModalOpen: onDeleteOpen, showSmallerVersion: isSelectable });

  const MemoizedGenericTable = React.useMemo(() => {
    return (
    <GenericTable 
      tableColumns={tableColumns}
      data={wineries.filter((winery: Winery) => winery.name.toLowerCase().includes(searchValue.toLowerCase()))}
      uiState={uiState}
      renderCell={renderCell}
      multipleSelection={isSelectable}
      onSelectionChange={onSelectionChange}
    />
    )
  }, [tableColumns, wineries, uiState, renderCell, isSelectable, onSelectionChange, searchValue]);

  //[tableColumns, wineries, uiState, renderCell, searchValue]

  return (
    <div className="py-4">
      <div className="flex items-center gap-4">
        <SearchInput 
          value={searchValue} 
          onValueChange={setSearchValue}
        />
        <Spacer className="flex-1" />
        {tableActions}
      </div>
      <div className="flex justify-between items-center py-4">
        <p className="text-sm">Number of wineries: {isSelectable ? `${selectedWineries?.length}/`: ""}{wineries.length}</p>
      </div>

      {MemoizedGenericTable}

      {/* Delete winery dialog */}
      <ModalDialog 
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        header={removeWineryFromParticipated ? "Remove Winery" : "Delete Winery"}
        onConfirm={async () => {
          if (wineryToRemove == null) { return; }
          if (removeWineryFromParticipated) {
            await removeWineryFromParticipated(wineryToRemove);
          } else if (deleteWinery) {
            await deleteWinery(wineryToRemove);
          }
          onDeleteClose(); 
        }}
      >
        <h1 className="text-lg font-semibold">{wineryToRemove?.name}</h1>
        <p> 
          {removeWineryFromParticipated 
            ? "Are you sure you want to remove this winery from the list?" 
            : "Are you sure you want to delete this winery?"
          }
        </p>
        <p className="">
          {removeWineryFromParticipated 
            ? "This action will remove the winery from the list of participated wineries and all its samples in catalogue." 
            : "This action will delete the winery from the database and its wines in all catalogues as well."}
        </p>
      </ModalDialog>

      {/* Edit winery dialog */}
        <CreateWineryModal
          winery={wineryToEdit ?? undefined}
          isOpen={isEditOpen}
          onOpenChange={onEditOpenChange}
          onWineryCreateOrEdit={updateWinery ?? (() => {})}
        />
    </div>
  )
}

export default WineryTable