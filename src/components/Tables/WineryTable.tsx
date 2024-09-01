import React, { useCallback } from 'react'
import UiStateHandler from '../UiStateHandler';
import SearchInput from '../SearchInput';
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { isStateLoading, UiState } from '../../communication/UiState';
import { GrapeVarietal } from '../../model/GrapeVarietal';
import { Winery } from '../../model/Winery';

const tableColumns = [
  {name: "NAME", uid: "name"},
  {name: "PHONENUMBER", uid: "phoneNumber"},
  {name: "EMAIL", uid: "email"},
  {name: "ADDRESS", uid: "address"}
];

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

type Props = { wineries: Winery[], uiState: UiState };

const WineryTable = ({ wineries, uiState }: Props) => {

  const renderCell = useCallback((winery: Winery, columnKey: React.Key) => {
    const cellValue = getNestedValue(winery, columnKey as string);

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
      // case "wineId.color":
      //   return (
      //     <Chip className="capitalize" color={wineColorMap[winery.wineId.color]} size="sm" variant="flat">
      //       {cellValue}
      //     </Chip>
      //   );
      // case "rating":
      //   return winery.champion ? ("🏆 " + cellValue) : cellValue;
      default:
        return cellValue;
    }
  }, []);


  return (
    <div>
      <UiStateHandler uiState={uiState} />
      <div className="flex items-center py-4">
        <p className="text-sm flex-1">Number of wineries: {wineries.length}</p>
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
        <TableBody isLoading={isStateLoading(uiState)} loadingContent={<Spinner color="primary"/>} items={wineries}>
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

export default WineryTable