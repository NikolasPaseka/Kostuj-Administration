import React, { useCallback } from 'react'
import SearchInput from '../SearchInput';
import { Chip, ChipProps, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { isStateLoading, UiState } from '../../communication/UiState';
import { WineSample } from '../../model/WineSample';
import { GrapeVarietal } from '../../model/GrapeVarietal';
import { Wine } from '../../model/Wine';

const tableColumns = [
  {name: "NAME", uid: "name"},
  {name: "WINENAME", uid: "wineId.name"},
  {name: "GRAPE", uid: "wineId.grapeVarietals"},
  {name: "COLOR", uid: "wineId.color"},
  {name: "YEAR", uid: "wineId.year"},
  {name: "WINERY", uid: "wineId.winaryId.name"},
  {name: "RATING", uid: "rating"},
];

const wineColorMap: Record<string, ChipProps["color"]>  = {
  red: "success",
  white: "danger",
  rose: "warning",
};

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

type Props = { wineSamples: WineSample[], uiState: UiState };

const WineTable = ({ wineSamples, uiState }: Props) => {

  const renderCell = useCallback((sample: WineSample, columnKey: React.Key) => {
    const cellValue = getNestedValue(sample, columnKey as string);

    switch (columnKey) {
      case "actions":
        return (
          <div>
            {/* Add your action buttons here */}
            <button>Edit</button>
            <button>Delete</button>
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
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
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
    </div>
  )
}

export default WineTable