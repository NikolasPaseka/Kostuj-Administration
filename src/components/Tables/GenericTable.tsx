import React from 'react'
import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { isStateLoading, UiState } from '../../communication/UiState';

export const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

interface ItemObject {
  id: string;
}

type Props<T> = { 
  tableColumns: {name: string, uid: string}[],
  data: T[], 
  uiState: UiState,
  renderCell: (item: T, columnKey: React.Key) => React.ReactNode;
};

const GenericTable = <T extends ItemObject>({ tableColumns, data, uiState, renderCell }: Props<T>) => {

  return (
    <div>
      <Table isStriped aria-label="Example table with custom cells">
        <TableHeader columns={tableColumns}>
          {(column) => (
            <TableColumn key={column.uid} align={"start"}>
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