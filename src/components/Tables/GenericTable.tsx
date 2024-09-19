import React from 'react'
import { SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { isStateLoading, UiState } from '../../communication/UiState';

export const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

interface ItemObject {
  id?: string;
}

type Props<T> = { 
  tableColumns: {name: string, uid: string, allowSorting?: boolean}[],
  data: T[], 
  uiState: UiState,
  sortDescriptor?: SortDescriptor,
  setSortDescriptor?: React.Dispatch<React.SetStateAction<SortDescriptor | undefined>>,
  renderCell: (item: T, columnKey: React.Key) => React.ReactNode;
  bottomContent?: React.ReactNode;
};

const GenericTable = <T extends ItemObject>({ tableColumns, data, uiState, sortDescriptor, setSortDescriptor, renderCell, bottomContent }: Props<T>) => {

  return (
    <div>
      <Table
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        isStriped 
        bottomContent={bottomContent}
        aria-label="Example table with custom cells"
        >
        <TableHeader columns={tableColumns}>
          {(column) => (
            <TableColumn key={column.uid} align={"start"} allowsSorting={column.allowSorting}>
              <b>{column.name}</b>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody isLoading={isStateLoading(uiState)} loadingContent={<Spinner color="primary"/>} items={data}>
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

export default GenericTable