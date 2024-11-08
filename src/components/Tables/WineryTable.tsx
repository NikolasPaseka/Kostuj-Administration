import React, { useCallback } from 'react'
import SearchInput from '../SearchInput';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure, User } from '@nextui-org/react';
import { UiState } from '../../communication/UiState';
import { Winery } from '../../model/Winery';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import GenericTable from './GenericTable';
import { useTranslation } from 'react-i18next';
import { TranslationNS } from '../../translations/i18n';
import { getNestedValue } from './getNestedValues';


type Props = { 
  wineries: Winery[], 
  uiState: UiState,
  removeWineryFromParticipated: (winery: Winery) => Promise<void>
};

const WineryTable = ({ wineries, uiState, removeWineryFromParticipated }: Props) => {

  const { t } = useTranslation();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [searchValue, setSearchValue] = React.useState<string>(""); 
  const [wineryToRemove, setWineryToRemove] = React.useState<Winery | null>(null);

  const tableColumns = [
    {name: t("winery", { ns: TranslationNS.catalogues }), uid: "name"},
    {name: t("emailAddress", { ns: TranslationNS.catalogues }), uid: "email"},
    {name: t("website", { ns: TranslationNS.catalogues }), uid: "websitesUrl"},
    {name: t("phoneNumber", { ns: TranslationNS.catalogues }), uid: "phoneNumber"},
    {name: t("placeAndAddress", { ns: TranslationNS.catalogues }), uid: "address"},
    {name: t("actions", { ns: TranslationNS.common }), uid: "actions"}
  ];

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
            <span className="cursor-pointer">
              <Tooltip content="Edit">
                  <PencilIcon className='w-5 h-5 text-gray-600' />
              </Tooltip>
            </span>
            <span onClick={() => {
              setWineryToRemove(winery);
              onOpen() 
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
  }, [onOpen]);

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
    <div>
      <div className="flex items-center py-4">
        <p className="text-sm flex-1">Number of wineries: {wineries.length}</p>
        <SearchInput value={searchValue} onValueChange={setSearchValue} />
      </div>

      {MemoizedGenericTable}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <h1>{wineryToRemove?.name}</h1>
                <p> 
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={async () => {
                  if (wineryToRemove == null) { return; }
                  await removeWineryFromParticipated(wineryToRemove);
                  onClose(); 
                }}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default WineryTable