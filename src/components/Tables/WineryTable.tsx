import React, { useCallback, useEffect } from 'react'
import SearchInput from '../SearchInput';
import { Spacer, Tooltip, useDisclosure, User } from '@nextui-org/react';
import { UiState } from '../../communication/UiState';
import { Winery } from '../../model/Winery';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import GenericTable from './GenericTable';
import { useTranslation } from 'react-i18next';
import { TranslationNS } from '../../translations/i18n';
import { getNestedValue } from './getNestedValues';
import ModalDialog from '../ModalDialog';
import CreateWineryModal from '../Modals/CreateWineryModal';


type Props = { 
  wineries: Winery[], 
  uiState: UiState,
  removeWineryFromParticipated?: (winery: Winery) => Promise<void>
  deleteWinery?: (winery: Winery) => Promise<void>
  updateWinery?: (winery: Winery) => Promise<void>
  tableActions?: React.ReactNode
};

const WineryTable = ({ wineries, uiState, removeWineryFromParticipated, deleteWinery, updateWinery, tableActions }: Props) => {

  const { t } = useTranslation();
  const {isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange, onClose: onDeleteClose} = useDisclosure();
  const {isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange} = useDisclosure();

  const [searchValue, setSearchValue] = React.useState<string>(""); 
  const [wineryToRemove, setWineryToRemove] = React.useState<Winery | null>(null);
  const [wineryToEdit, setWineryToEdit] = React.useState<Winery | null>(null);

  const tableColumns = [
    {name: t("winery", { ns: TranslationNS.catalogues }), uid: "name"},
    {name: t("placeAndAddress", { ns: TranslationNS.catalogues }), uid: "address"},
    {name: t("emailAddress", { ns: TranslationNS.catalogues }), uid: "email"},
    {name: t("phoneNumber", { ns: TranslationNS.catalogues }), uid: "phoneNumber"},
    {name: t("website", { ns: TranslationNS.catalogues }), uid: "websitesUrl"},
    {name: t("actions", { ns: TranslationNS.common }), uid: "actions"}
  ];

  useEffect(() => {
    if (wineryToEdit) {
      onEditOpen();
    }
  }, [onEditOpen, wineryToEdit])

  const renderCell = useCallback((winery: Winery, columnKey: React.Key) => {
    const cellValue = getNestedValue(winery, columnKey as string);

    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{radius: "lg", src: winery.imageUrl}}
            description={""}
            name={cellValue}
          >
            {winery.name}
          </User>
        );
      case "websitesUrl":
        return (
          <div className="w-64">
            <a href={cellValue} target="_blank" rel="noreferrer" className="text-red-500 break-all">
            {cellValue}
            </a>
          </div>
  
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <span className="cursor-pointer">
              <Tooltip content="Details">
                  <EyeIcon className='w-5 h-5 text-gray-600' />
              </Tooltip>
            </span>
            <span 
              onClick={() => {
                setWineryToEdit({ ...winery });
              }}
              className="cursor-pointer">
              <Tooltip content="Edit">
                  <PencilIcon className='w-5 h-5 text-gray-600' />
              </Tooltip>
            </span>
            <span onClick={() => {
              setWineryToRemove(winery);
              onDeleteOpen() ;
            }} className="cursor-pointer">
              <Tooltip color="danger" content="Delete">
                  <TrashIcon className='w-5 h-5 text-danger' />
              </Tooltip>
            </span>
          </div>
        );
      default:
        return cellValue;
    }
  }, [onDeleteOpen]);

  const MemoizedGenericTable = React.useMemo(() => {
    console.log("memo render")
    return (
    <GenericTable 
      tableColumns={tableColumns}
      data={wineries.filter((winery: Winery) => winery.name.toLowerCase().includes(searchValue.toLowerCase()))}
      uiState={uiState}
      renderCell={renderCell}
    />
    )
  }, [wineries, searchValue, uiState, renderCell]);

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
      <div className="flex items-center py-4">
        <p className="text-sm flex-1">Number of wineries: {wineries.length}</p>
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