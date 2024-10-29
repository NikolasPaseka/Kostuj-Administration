import React from 'react'
import { SortDescriptor, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { isStateLoading, UiState } from '../../communication/UiState';

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
};

const GenericTable = <T extends ItemObject>({ tableColumns, data, uiState, sortDescriptor, setSortDescriptor, renderCell, bottomContent}: Props<T>) => {
  console.log("nested render")

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
            <TableColumn key={column.uid} align={"start"} allowsSorting={column.allowSorting} className='max-w-16'>
              <b>{column.name}</b>
            </TableColumn>
          )}
        </TableHeader>
          <TableBody isLoading={isStateLoading(uiState)} loadingContent={<Spinner color="primary"/>} items={data}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => 
                  <TableCell>
                    {renderCell(item, columnKey)
                   
                    }
                  </TableCell>}
              </TableRow>
            )}
            {/* {memoList} */}
          </TableBody>

      </Table>
    </div>
  )
}

export default GenericTable