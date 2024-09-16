import React, { useCallback } from 'react'
import SearchInput from '../SearchInput';
import { Button, Chip, ChipProps, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure, Selection, Spacer, Tabs, Tab, Badge, SortDescriptor } from '@nextui-org/react';
import { UiState } from '../../communication/UiState';
import { WineSample } from '../../model/WineSample';
import { GrapeVarietal } from '../../model/GrapeVarietal';
import { Wine } from '../../model/Wine';
import { AdjustmentsHorizontalIcon, ChevronDownIcon, ClipboardDocumentCheckIcon, EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import GenericTable, { getNestedValue } from './GenericTable';
import { WineColor } from '../../model/Domain/WineColor';
import PrimaryButton from '../PrimaryButton';
import { Winery } from '../../model/Winery';

const tableColumns = [
  {name: "NAME", uid: "name"},
  {name: "WINENAME", uid: "wineId.name"},
  {name: "GRAPE", uid: "wineId.grapeVarietals"},
  {name: "COLOR", uid: "wineId.color"},
  {name: "YEAR", uid: "wineId.year", allowSorting: true},
  {name: "WINERY", uid: "wineId.winaryId.name"},
  {name: "RATING", uid: "rating", allowSorting: true},
  {name: "ACTIONS", uid: "actions"}
];

const wineColorMapChip: Record<string, ChipProps["color"]>  = {
  red: "danger",
  white: "success",
  rose: "warning",
};

const wineColorOptions = [
  {name: "Red", uid: WineColor.RED},
  {name: "White", uid: WineColor.WHITE},
  {name: "Rose", uid: WineColor.ROSE}
];

// const groupSelectionOptions = [
//   {name: "Wineries", uid: "wineries"},
//   {name: "Grapes", uid: "grapes"},
// ]

type Props = { 
  wineSamples: WineSample[], 
  uiState: UiState,
  deleteWineSample?: (wineSample: WineSample) => Promise<void>
};

const WineTable = ({ wineSamples, uiState, deleteWineSample }: Props) => {

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const [searchValue, setSearchValue] = React.useState<string>("");
  const [colorFilter, setColorFilter] = React.useState<Selection>("all");
  const [groupSelection, setGroupSelection] = React.useState<string>("wineriesOrder");
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor | undefined>(undefined);

  const [sampleToRemove, setSampleToRemove] = React.useState<WineSample | null>(null);

  // first filter items and then sort them for final result
  const filteredSamples = React.useMemo(() => {
    let filteredSamples = [...wineSamples];

    if (searchValue.length > 0) {
      filteredSamples = filteredSamples.filter((sample) =>
        sample.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        (sample.wineId as Wine).name.toLowerCase().includes(searchValue.toLowerCase()) ||
        ((sample.wineId as Wine).winaryId as Winery).name.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }
    if (colorFilter !== "all" && Array.from(colorFilter).length !== wineColorOptions.length) {
      filteredSamples = filteredSamples.filter((sample) =>
        Array.from(colorFilter).includes((sample.wineId as Wine).color),
      );
    }

    return filteredSamples;
  }, [wineSamples, colorFilter, searchValue]);

  // sort items for final result -- this is passed to the GenericTable
  const sortedItems = React.useMemo(() => {
    const sortByWinery = (a: WineSample, b: WineSample) => {
      const aWinery = (a.wineId as Wine).winaryId as Winery;
      const bWinery = (b.wineId as Wine).winaryId as Winery;
      return aWinery.name > bWinery.name 
        ? 1 
        : aWinery.name < bWinery.name ? -1 : 0;
    }
    const sortByGrape = (a: WineSample, b: WineSample) => {
      const aGrapeVarietal = (a.wineId as Wine).grapeVarietals?.[0]?.grape ?? "zzz"; // leave empty grapes for the end
      const bGrapeVarietal = (b.wineId as Wine).grapeVarietals?.[0]?.grape ?? "zzz";
      return aGrapeVarietal > bGrapeVarietal 
        ? 1 
        : aGrapeVarietal < bGrapeVarietal ? -1 : 0;
    }
    const sortByTableColumns = (a: WineSample, b: WineSample, previousSortResult: number) => {
      if (sortDescriptor?.column === "rating") {
        const directionMultiplier = sortDescriptor.direction === "ascending" ? 1 : -1;
        return (a.rating ?? 0) < (b.rating ?? 0) ? -1 * directionMultiplier : 1 * directionMultiplier;
      } else if (sortDescriptor?.column === "wineId.year") {
        const directionMultiplier = sortDescriptor.direction === "ascending" ? 1 : -1;
        return (a.wineId as Wine).year < (b.wineId as Wine).year ? -1 * directionMultiplier : 1 * directionMultiplier;
      }
      else { 
        return previousSortResult; 
      }
    }
    
    return [...filteredSamples].sort((a: WineSample, b: WineSample) => {
      if (groupSelection === "wineriesOrder") {
        const winerySortRes = sortByWinery(a, b);
        if (winerySortRes != 0) { return winerySortRes; }
        return sortByTableColumns(a, b, winerySortRes);
      } else {
        const grapeSortRes = sortByGrape(a, b);
        if (grapeSortRes != 0) { return grapeSortRes; }
        return sortByTableColumns(a, b, grapeSortRes);
      }
    });
  }, [filteredSamples, groupSelection, sortDescriptor]);

  const renderCell = useCallback((sample: WineSample, columnKey: React.Key) => {
    const cellValue = getNestedValue(sample, columnKey as string);

    switch (columnKey) {
      case "actions":
        return (
          <div className=" relative flex items-center gap-2 w-0">
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
          <Chip className="capitalize" color={wineColorMapChip[(sample.wineId as Wine).color]} size="sm" variant="flat">
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
      <div className="flex items-center py-4 gap-4">
        <SearchInput value={searchValue} onValueChange={setSearchValue} className='w-64' />
        <Tabs
          selectedKey={groupSelection}
          onSelectionChange={(key) => setGroupSelection(key.toString())}
          color="secondary" 
          variant="solid" 
          size="lg" 
          aria-label="Group Options"
        >
          <Tab key="wineriesOrder" title="Wineries"/>
          <Tab key="grapeOrder" title="Grapes"/>
        </Tabs>

        <Badge content={Array.from(colorFilter).length} variant="solid" color="secondary" isInvisible={Array.from(colorFilter).length == wineColorOptions.length}>
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                size="md"
                color="secondary"
                variant="bordered"
                endContent={<ChevronDownIcon className="w-4 h-4" />}
              >
                Wine Color
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={colorFilter}
              selectionMode="multiple"
              onSelectionChange={setColorFilter}
            >
              {wineColorOptions.map((color) => (
                <DropdownItem key={color.uid}>
                  <div className="flex items-center">
                  <div className={`h-4 w-4 rounded-full bg-${wineColorMapChip[color.uid]} mr-2`}/>
                  {color.name}
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Badge>
        <Button 
          endContent={<AdjustmentsHorizontalIcon className="w-7 h-7 text-secondary" />}
          onClick={() => {}}
          color="secondary"
          variant="bordered"
          className="min-w-10"
        />

        <Spacer className="flex-1" />

        <PrimaryButton
          isSecondary
          EndContent={ClipboardDocumentCheckIcon}
        >
          Auto numbering
        </PrimaryButton>
        <PrimaryButton
          EndContent={PlusIcon}
        >
          Add New
        </PrimaryButton>
      </div>
      <p className="text-sm pb-4">Number of samples: {sortedItems.length}</p>

      <GenericTable 
        tableColumns={tableColumns}
        data={sortedItems}
        uiState={uiState}
        sortDescriptor={sortDescriptor}
        setSortDescriptor={setSortDescriptor}
        renderCell={renderCell}
      />

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