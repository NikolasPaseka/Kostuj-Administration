import React, { useCallback } from 'react'
import SearchInput from '../SearchInput';
import { Button, Chip, ChipProps, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip, useDisclosure } from '@nextui-org/react';
import { isStateLoading, UiState } from '../../communication/UiState';
import { WineSample } from '../../model/WineSample';
import { GrapeVarietal } from '../../model/GrapeVarietal';
import { Wine } from '../../model/Wine';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { getNestedValue } from './GenericTable';

const tableColumns = [
  {name: "NAME", uid: "name"},
  {name: "WINENAME", uid: "wineId.name"},
  {name: "GRAPE", uid: "wineId.grapeVarietals"},
  {name: "COLOR", uid: "wineId.color"},
  {name: "YEAR", uid: "wineId.year"},
  {name: "WINERY", uid: "wineId.winaryId.name"},
  {name: "RATING", uid: "rating"},
  {name: "ACTIONS", uid: "actions"}
];

const wineColorMap: Record<string, ChipProps["color"]>  = {
  red: "success",
  white: "danger",
  rose: "warning",
};

type Props = { 
  wineSamples: WineSample[], 
  uiState: UiState,
  deleteWineSample?: (wineSample: WineSample) => Promise<void>
};

const WineTable = ({ wineSamples, uiState, deleteWineSample }: Props) => {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [sampleToRemove, setSampleToRemove] = React.useState<WineSample | null>(null);

  const renderCell = useCallback((sample: WineSample, columnKey: React.Key) => {
    const cellValue = getNestedValue(sample, columnKey as string);

    switch (columnKey) {
      case "actions":
        return (
          <div className="flex items-center gap-2 w-0">
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
              setSampleToRemove(sample);
              onOpen() 
            }} className="cursor-pointer">
              <Tooltip color="danger" content="Delete">
                  <TrashIcon className='w-5 h-5 text-danger' />
              </Tooltip>
            </span>
          </div>
        );
      case "wineId.grapeVarietals":
        return cellValue?.map((grape: GrapeVarietal) => grape.grape).join(", ");
      case "wineId.color":
        return (
          <Chip className="capitalize" color={wineColorMap[(sample.wineId as Wine).color]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "rating":
        return sample.champion ? ("🏆 " + cellValue) : cellValue;
      default:
        return cellValue;
    }
  }, []);


  return (
    <div>
      <div className="flex items-center py-4">
        <p className="text-sm flex-1">Number of samples: {wineSamples.length}</p>
        <SearchInput value="" onValueChange={() => {}} />
      </div>
      <Table isStriped aria-label="Example table with custom cells">
        <TableHeader columns={tableColumns}>
          {(column) => (
            <TableColumn key={column.uid} align={"start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody isLoading={isStateLoading(uiState)} loadingContent={<Spinner color="primary"/>} items={wineSamples}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <h1>{sampleToRemove?.name}</h1>
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
                  if (sampleToRemove == null) { return; }
                  if (deleteWineSample) {
                    await deleteWineSample(sampleToRemove);
                  }
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

export default WineTable