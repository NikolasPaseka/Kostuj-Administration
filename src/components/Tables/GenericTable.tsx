import React from 'react'
import { SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { isStateLoading, UiState } from '../../communication/UiState';
import VoidListImage from '../../assets/void_list.svg';

// Table flag is added to change the value of each data that will cause re-rendering of the table
interface ItemObject {
  id?: string;
  tableFlag?: "display" | "edit" | "updated";
}

type Props<T> = { 
  tableColumns: {name: string, uid: string, allowSorting?: boolean}[],
  data: T[], 
  uiState: UiState,
  sortDescriptor?: SortDescriptor,
  setSortDescriptor?: React.Dispatch<React.SetStateAction<SortDescriptor | undefined>>,
  renderCell: (item: T, columnKey: React.Key) => React.ReactNode;
  bottomContent?: React.ReactNode;
  inEditMode?: boolean;
  multipleSelection?: boolean;
  onSelectionChange?: (data: T[]) => void;
};

type Key = string | number;

const GenericTable = <T extends ItemObject>({ tableColumns, data, uiState, sortDescriptor, setSortDescriptor, renderCell, bottomContent, multipleSelection, onSelectionChange }: Props<T>) => {

  const [selectedKeys, setSelectedKeys] = React.useState<T[]>([]);

  return (
    <div>
      <Table
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        selectionMode={multipleSelection ? "multiple" : "none"}
        isStriped 
        bottomContent={bottomContent}
        selectedKeys={selectedKeys.map((item) => item.id) as unknown as Iterable<Key>}
        onSelectionChange={(keys) => { 
          if (keys === "all") {
            setSelectedKeys(data);
            if (onSelectionChange) { onSelectionChange(data); }
          } else if (keys instanceof Set) {
            setSelectedKeys(data.filter((item) => keys.has(item.id ?? "")));
            if (onSelectionChange) { onSelectionChange(data.filter((item) => keys.has(item.id ?? ""))); }
          }
        }}
        aria-label="Example table with custom cells"
        >
        <TableHeader columns={tableColumns}>
          {(column) => (
            <TableColumn key={column.uid} align={"start"} allowsSorting={column.allowSorting} className='max-w-16'>
              <b>{column.name}</b>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody 
          isLoading={isStateLoading(uiState)}
          loadingContent={<Spinner color="primary"/>}
          emptyContent={
            <div className="flex flex-col items-center justify-center py-4 gap-4">
              <img src={VoidListImage} alt="React Logo" className="w-36" />
              <p className="text-gray-500">No data available</p>
            </div>
          }
          items={data}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => 
                <TableCell>
                  {renderCell(item, columnKey)}
                </TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default GenericTable