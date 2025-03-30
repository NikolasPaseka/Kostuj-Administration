import React, { useCallback, useEffect, useRef } from 'react'
import SearchInput from '../../SearchInput';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure, Selection, Spacer, Tabs, Tab, Badge, SortDescriptor, Pagination, CircularProgress } from "@heroui/react";
import { UiState } from '../../../communication/UiState';
import { WineSample } from '../../../model/WineSample';
import { GrapeVarietal } from '../../../model/GrapeVarietal';
import { Wine, WineUtil } from '../../../model/Wine';
import { AdjustmentsHorizontalIcon, CheckIcon, ChevronDownIcon, ClipboardDocumentCheckIcon, EyeIcon, PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import GenericTable from '../GenericTable';
import { WineColor } from '../../../model/Domain/WineColor';
import PrimaryButton from '../../PrimaryButton';
import { Winery } from '../../../model/Winery';
import AutoLabelModal from '../../Modals/AutoLabelModal';
import GenericInput from '../../GenericInput';
import { getNestedValue } from '../getNestedValues';
import { TableFlag } from '../TableFlagType';
import ExportSamplesModal from '../../Modals/ExportSamplesModal';
import { WineSampleExport } from '../../../model/ExportType/WineSampleExport';
import WineFilterModal from '../../Modals/WineFilterModal';
import { RangeFilter } from '../../../model/Domain/RangeFilter';
import AutoCommissionModal from '../../Modals/AutoCommissionModal';

const tableColumns = [
  {name: "Označení", uid: "name"},
  {name: "Víno", uid: "wineId.name"},
  //{name: "GRAPE", uid: "wineId.grapeVarietals"},
  //{name: "COLOR", uid: "wineId.color"},
  {name: "Ročník", uid: "wineId.year", allowSorting: true},
  {name: "Vinařství", uid: "wineId.winaryId.name"},
  {name: "Sladkost", uid: "wineId.resultSweetness"},
  {name: "Přívlastek", uid: "wineId.attribute"},
  {name: "Hodnocení", uid: "rating", allowSorting: true},
  {name: "Komise", uid: "ratingCommission"},
  {name: "Poznámka", uid: "note"},
  {name: "Akce", uid: "actions"}
];

const iconClassName = "w-4 h-4 text-secondary";
const actionItems = [
  {
    key: "newSample",
    label: "New Sample",
    description: "Navigate to create new samples",
    startContent: <PlusIcon className={iconClassName} />,
  },
  {
    key: "edit",
    label: "Edit Samples",
    description: "Switch to editing mode",
    startContent: <PencilIcon className={iconClassName} />,
  },
  {
    key: "exportToExcel",
    label: "Export to Excel",
    description: "Export current filtered samples to Excel",
    startContent: <AdjustmentsHorizontalIcon className={iconClassName} />,
  },
  {
    key: "autoLabel",
    label: "Automatic Labeling",
    description: "Automatic label samples by prefix and order",
    startContent: <ClipboardDocumentCheckIcon className={iconClassName} />,
  }, {
    key: "autoCommission",
    label: "Auto assign commission",
    description: "Automatically assign wine samples to commission",
    startContent: <ClipboardDocumentCheckIcon className={iconClassName} />,
  }
];

const wineColorChipColor: Record<string, string>  = {
  [WineColor.RED]: "redWineColor",
  [WineColor.WHITE]: "whiteWineColor",
  [WineColor.ROSE]: "roseWineColor",
  [WineColor.OTHER]: "otherWineColor",
};

const wineColorOptions = [
  {name: "Red", uid: WineColor.RED},
  {name: "White", uid: WineColor.WHITE},
  {name: "Rose", uid: WineColor.ROSE},
  {name: 'Other', uid: WineColor.OTHER}
];

// const groupSelectionOptions = [
//   {name: "Wineries", uid: "wineries"},
//   {name: "Grapes", uid: "grapes"},
// ]

// TODO change max rating
const minRating = 0;
const maxRating = 100;
const maxYear = new Date().getFullYear();

type Props = { 
  wineSamples: WineSample[], 
  uiState: UiState,
  deleteWineSample?: (wineSample: WineSample) => Promise<void>
  autoLabelSamples?: (prefix: string, orderType: string, colorOrder: string[]) => Promise<void>
  updateSamples?: (updatedSamples: WineSample[]) => void
  exportToExcel?: (samples: WineSample[], seperateByCategory?: boolean, category?: keyof WineSampleExport) => void
  showTableControls?: boolean
};

const WineTable = ({ wineSamples, uiState, deleteWineSample, autoLabelSamples, updateSamples, exportToExcel, showTableControls=true }: Props) => {

  // Modals
  const {isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onOpenChange: onDeleteModalOpenChange} = useDisclosure();
  const {isOpen: isFilterModalOpen, onOpen: onFilterModalOpen, onOpenChange: onFilterModalOpenChange} = useDisclosure();
  const {isOpen: isAutoLabelingModalOpen, onOpen: onAutoLabelingModalOpen, onOpenChange: onAutoLabelingModalOpenChange} = useDisclosure();
  const {isOpen: isExportModalOpen, onOpen: onExportModalOpen, onOpenChange: onExportModalOpenChnage} = useDisclosure();
  const {isOpen: isAutoCommissionOpen, onOpen: onAutoCommissionOpen, onOpenChange: onAutoCommissionOpenChange} = useDisclosure();

  // Filter constants
  const [minYear, setMinYear] = React.useState<number>(0);
  const [ratingCommissions, setRatingCommissions] = React.useState<(number | null)[]>([]);

  // Table Filtering and sorting
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [colorFilter, setColorFilter] = React.useState<Selection>("all");
  const [ratingFilterRange, setRatingFilterRange] = React.useState<RangeFilter>({min: minRating, max: maxRating});
  const [yearFilterRange, setYearFilterRange] = React.useState<RangeFilter>({min: minYear, max: maxYear});
  const [ratingCommissionFilter, setRatingCommissionFilter] = React.useState<(number | null)[]>([]);
  const [groupSelection, setGroupSelection] = React.useState<string>("grapeOrder");
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor | undefined>(undefined);

  const [wineSamplesState, setWineSamplesState] = React.useState<(WineSample & TableFlag)[]>(wineSamples);
  const [inEditMode, setInEditMode] = React.useState<boolean>(false);
  const [sampleToRemove, setSampleToRemove] = React.useState<WineSample | null>(null);
  const [commissionInput, setCommissionInput] = React.useState<number>(0);

  // Optional pagination
  const [page, setPage] = React.useState<number>(1);
  const rowsPerPage = inEditMode ? 60 : 60;

  useEffect(() => {
    setWineSamplesState(wineSamples.map(sample => ({...sample, tableFlag: "display"})));
    setMinYear(Math.min(...wineSamples.map(sample => {
      if ((sample.wineId as Wine).year == 0) { return Number.MAX_VALUE; }
      return (sample.wineId as Wine).year
    })));
    setRatingCommissions(Array.from(new Set(wineSamples.map(sample => sample.ratingCommission ?? null))));
  }, [wineSamples]);

  // first filter items and then sort them for final result
  const previousFilteredSamples = useRef<(WineSample & TableFlag)[]>([]);
  const filteredSamples = React.useMemo(() => {
    if (inEditMode) {
      return previousFilteredSamples.current.map(sample => {
        const updatedSample = wineSamplesState.find(s => s.id === sample.id && (s.tableFlag === "updated" || s.tableFlag === "edit"));
        return updatedSample ? updatedSample : sample;
      });
    }
    
    let filteredSamples = [...wineSamplesState];
    if (!inEditMode) {
     setPage(1); // reset page when filtering
    }

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
    
    // Filter by rating
    if (ratingFilterRange.min !== minRating || ratingFilterRange.max !== maxRating) {
      filteredSamples = filteredSamples.filter((sample) => {
        if (sample.rating == null) { return false; }
        return sample.rating >= ratingFilterRange.min && sample.rating <= ratingFilterRange.max;
      });
    }
    // Filter by year
    if (yearFilterRange.min !== minYear || yearFilterRange.max !== maxYear) {
      filteredSamples = filteredSamples.filter((sample) => {
        const wine = sample.wineId as Wine;
        return wine.year >= yearFilterRange.min && wine.year <= yearFilterRange.max
      });
    } 
    // Filter by commission
    if (ratingCommissionFilter.length > 0) {
      filteredSamples = filteredSamples.filter((sample) => {
        if (sample.ratingCommission == null) { return ratingCommissionFilter.includes(null); }
        return ratingCommissionFilter.includes(sample.ratingCommission);
      })
    }

    previousFilteredSamples.current = filteredSamples;
    return filteredSamples;
  }, [wineSamplesState, inEditMode, searchValue, colorFilter, ratingFilterRange, yearFilterRange, minYear, ratingCommissionFilter]);

  // sort items for final result -- this is passed to the GenericTable
  const sortedItems = React.useMemo(() => {
    // sorting helper functions
    const sortByWinery = (a: WineSample, b: WineSample) => {
      const aWinery = (a.wineId as Wine).winaryId as Winery;
      const bWinery = (b.wineId as Wine).winaryId as Winery;
      return aWinery.name > bWinery.name 
        ? 1 
        : aWinery.name < bWinery.name ? -1 : 0;
    }
    const sortByGrape = (a: WineSample, b: WineSample) => {
      const aGrapeVarietal = (a.wineId as Wine).name ?? "zzz"; // leave empty grapes for the end
      const bGrapeVarietal = (b.wineId as Wine).name ?? "zzz";
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
        // if winery is the same, sort by other columns
        if (winerySortRes != 0) { return winerySortRes; }
        return sortByTableColumns(a, b, winerySortRes);
      } else {
        const grapeSortRes = sortByGrape(a, b);
        // if grape is the same, sort by other columns
        if (grapeSortRes != 0) { return grapeSortRes; }
        return sortByTableColumns(a, b, grapeSortRes);
      }
    });
  }, [filteredSamples, groupSelection, sortDescriptor]);

  // optionaly paginate items
  const pages = Math.ceil(sortedItems.length / rowsPerPage);
  const usePagination = pages > 2;
  const finalItems = React.useMemo(() => {
    if (usePagination) {
      return sortedItems
        .slice((page - 1) * rowsPerPage, page * rowsPerPage)
        
    } else {
      return sortedItems;
    }
  }, [usePagination, sortedItems, page]);

  const updateSample = (updatedSample: WineSample & TableFlag) => {
    updatedSample.tableFlag = "updated";
    setWineSamplesState((prevSamples) =>
      prevSamples.map((sample) =>
        sample.id === updatedSample.id ? updatedSample : sample
      )
    );
  };

  const renderCell = useCallback((sample: WineSample, columnKey: React.Key) => {
    const cellValue = getNestedValue(sample, columnKey as string);
    switch (columnKey) {
      case "name":
        if (inEditMode) {
          return (
            <GenericInput 
              value={sample.name ?? ""} 
              onChange={(value) => {
                const updatedSample = { ...sample, name: value };
                updateSample(updatedSample); // Update the state with the new value
              }}
              className="w-24"
            />
          );
        } else {
          return cellValue;
        }
      case "wineId.name":
        return (
          <div className='flex items-center gap-2'>
            <span className={`h-4 w-4 rounded-full bg-${wineColorChipColor[(sample.wineId as Wine).color]}`}></span>
            {cellValue}
          </div>
        )
      case "actions":
        return (
          <div className=" relative flex items-center gap-2 w-0">
            <span className="cursor-pointer">
              <Tooltip content="Details">
                  <EyeIcon className='w-5 h-5 text-gray-600' />
              </Tooltip>
            </span>
            {/* <span className="cursor-pointer">
              <Tooltip content="Edit">
                  <PencilIcon className='w-5 h-5 text-gray-600' />
              </Tooltip>
            </span> */}
            <span onClick={() => {
              setSampleToRemove(sample);
              onDeleteModalOpen() 
            }} className="cursor-pointer">
              <Tooltip color="danger" content="Delete">
                  <TrashIcon className='w-5 h-5 text-danger' />
              </Tooltip>
            </span>
          </div>
        );
      case "wineId.grapeVarietals":
        return cellValue?.map((grape: GrapeVarietal) => grape.grape).join(", ");
      case "rating":
        if (inEditMode) {
          return (
            <GenericInput 
              value={sample.rating?.toString() ?? ""} 
              onChange={(value) => {
                const updatedSample = { ...sample, rating: parseInt(value) };
                updateSample(updatedSample); // Update the state with the new value
              }}
              type='number'
              className='w-20'
            />
          );
        } else {
          return (
            <div className="flex items-center gap-2">
            <CircularProgress
              aria-label="Loading..."
              size="md"
              value={cellValue}
              color={cellValue > 80 ? "success" : cellValue > 60 ? "warning" : "danger"}
              showValueLabel={true}
              formatOptions={{ style: "decimal", maximumFractionDigits: 0 }}
              classNames={{
                value: "text-sm font-semibold",
              }}
            />
            {sample.champion && "👑"}
            </div>
          )
        }
    case "ratingCommission":
      if (inEditMode) {
        return (
          <GenericInput 
            value={sample.ratingCommission?.toString() ?? ""} 
            onChange={(value) => {
              const updatedSample = { ...sample, ratingCommission: parseInt(value) };
              updateSample(updatedSample);
            }}
            type='number'
            className="w-20"
          />
        );
      } else {
        return cellValue;
      }
      case "note":
        if (inEditMode) {
          return (
            <GenericInput 
              value={sample.note ?? ""} 
              onChange={(value) => {
                const updatedSample = { ...sample, note: value };
                updateSample(updatedSample); 
              }}
              className="w-48"
            />
          );
        } else {
          return cellValue;
        }
      case "wineId.resultSweetness":
        return WineUtil.getResultSweetnessLabel(sample.wineId as Wine);
      default:
        return cellValue;
    }
  }, [inEditMode, onDeleteModalOpen]);

  const MemoizedGenericTable = React.useMemo(() => {
    return (
    <GenericTable 
        tableColumns={tableColumns}
        data={finalItems} 
        uiState={uiState}
        sortDescriptor={sortDescriptor}
        setSortDescriptor={setSortDescriptor}
        renderCell={(item, columnKey) => renderCell(item as WineSample, columnKey)}
        inEditMode={inEditMode}
        bottomContent={
          usePagination &&
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
        }
      />
    )
  }, [finalItems, uiState, sortDescriptor, inEditMode, usePagination, page, pages, renderCell]);

  return (
    <div>
      <div className="flex items-center py-4 gap-4">
        <SearchInput value={searchValue} onValueChange={setSearchValue} className='w-64' isDisabled={inEditMode} />
        <Tabs
          selectedKey={groupSelection}
          onSelectionChange={(key) => setGroupSelection(key.toString())}
          color="secondary" 
          variant="solid" 
          size="lg" 
          aria-label="Group Options"
          isDisabled={inEditMode}
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
                isDisabled={inEditMode}
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
                  <div className={`h-4 w-4 rounded-full bg-${wineColorChipColor[color.uid]} mr-2`}/>
                  {color.name}
                  </div>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </Badge>
        <Button 
          endContent={<AdjustmentsHorizontalIcon className="w-7 h-7 text-secondary" />}
          onClick={onFilterModalOpen}
          isDisabled={inEditMode}
          color="secondary"
          variant="bordered"
          className="min-w-10"
        />

        {showTableControls &&
          <>
          <Spacer className="flex-1" />

          <Dropdown>
            <DropdownTrigger>
              <Button
                color="primary"
                endContent={<ChevronDownIcon className="w-4 h-4" />}
                isDisabled={inEditMode}
              >
                Samples Actions
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Dynamic Actions" 
              items={actionItems}
              onAction={(key) => {
                if (key === "newSample") {
                  // TODO navigate to new samples
                } else if (key === "autoLabel") {
                  onAutoLabelingModalOpen();
                } else if (key === "edit") {
                  setInEditMode(true);
                  setWineSamplesState(wineSamples.map((sample) => ({...sample, tableFlag: "edit"})));
                } else if (key === "exportToExcel") {
                  onExportModalOpen();
                } else if (key === "autoCommission") {
                  onAutoCommissionOpen();
                }
              }}
            >
              {(item) => (
                <DropdownItem
                  key={item.key}
                  startContent={item.startContent}
                  description={item.description}
                >
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
          </>
        }
      </div>
      <div className="flex items-center pb-4">
        <div className='flex-1'>
          <p className="text-sm">Počet vzorků: {filteredSamples.length}</p>
          {inEditMode &&(
            <div className='flex flex-row gap-2 items-center'>
            <p className='text-sm'>Zařadit do komise č.:</p>
            <GenericInput 
              value={commissionInput.toString()}
              onChange={(val) => { setCommissionInput(Number(val)); }}
              className='w-20'
            />
            <PrimaryButton
              isSecondary={true}
              onClick={() => {
                setWineSamplesState((prevSamples) => prevSamples.map((sample) => {
                  if (filteredSamples.some((s) => s.id === sample.id)) {
                    return { ...sample, ratingCommission: commissionInput, tableFlag: "updated" };
                  }
                  return sample;
                }));
              }}
            >
              Ok
            </PrimaryButton>
            </div>
          )}
        </div>
        {inEditMode &&
          <div className="flex gap-3">
          <PrimaryButton isSecondary
            onClick={() => {
              setInEditMode(false);
              setWineSamplesState(wineSamples.map((sample) => ({...sample, tableFlag: "display"})));
            }}
            EndContent={XMarkIcon}
          >
            Cancel
          </PrimaryButton>

          <PrimaryButton
            onClick={() => {
              setInEditMode(false);
              const editedSamples = wineSamplesState.filter((sample) => sample.tableFlag === "updated");
              if (updateSamples) { updateSamples(editedSamples); }

              setWineSamplesState((prevSamples) => prevSamples.map((sample) => ({...sample, tableFlag: "display" })));
            }}
            EndContent={CheckIcon}
          >
            Save
          </PrimaryButton>
          </div>
        }
      </div>
    
      {MemoizedGenericTable}

      {/* Modal - Delete Wine Sample */}
      <Modal isOpen={isDeleteModalOpen} onOpenChange={onDeleteModalOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Wine Sample</ModalHeader>
              <ModalBody>
                <h1>{sampleToRemove?.name}</h1>
                <p> 
                  Are you sure you want to delete this wine sample?
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
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal - Filter table */}
      <WineFilterModal 
        isOpen={isFilterModalOpen}
        onOpenChange={onFilterModalOpenChange}
        maxRating={maxRating}
        minYear={minYear}
        ratingCommissions={ratingCommissions}
        onApplyFilter={(yearRange, ratingRange, filteredCommissions) => {
          setYearFilterRange(yearRange);
          setRatingFilterRange(ratingRange);
          if (filteredCommissions != null) {
            setRatingCommissionFilter(filteredCommissions);
          } else {
            setRatingCommissionFilter(ratingCommissions);
          }
        }}
      />

      {/* Modal - Auto label */}
      <AutoLabelModal 
        isOpen={isAutoLabelingModalOpen} 
        onOpenChange={onAutoLabelingModalOpenChange} 
        autoLabelSamples={autoLabelSamples}
      />

      <ExportSamplesModal 
        isOpen={isExportModalOpen} 
        onOpenChange={onExportModalOpenChnage} 
        onConfirm={(onlyFilteredSamples, seperateByCategory, category) => {
          if (!exportToExcel) { return; }

          const samplesToExport = onlyFilteredSamples ? sortedItems : wineSamples;
          exportToExcel(samplesToExport, seperateByCategory, category);
        }}
      />

      <AutoCommissionModal 
        isOpen={isAutoCommissionOpen}
        onOpenChange={onAutoCommissionOpenChange} 
      />
    </div>
  )
}

export default WineTable