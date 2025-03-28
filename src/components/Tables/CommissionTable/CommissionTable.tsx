import React from 'react'
import { UiState } from '../../../communication/UiState';
import GenericTable from '../GenericTable';
import { Commission } from '../../../model/Domain/Commission';
import useCommissionTableRender from './useCommissionTableRender';


type Props = { 
  commissions: Commission[], 
  uiState: UiState,
};

const CommissionTable = ({ commissions, uiState }: Props) => {
  
  const { renderCell, tableColumns } = useCommissionTableRender();

  const MemoizedGenericTable = React.useMemo(() => {
    return (
    <GenericTable 
      tableColumns={tableColumns}
      data={commissions}
      uiState={uiState}
      renderCell={renderCell}
    />
    )
  }, [tableColumns, commissions, uiState, renderCell]);

  //[tableColumns, wineries, uiState, renderCell, searchValue]

  return (
    <div className="py-4">

      {MemoizedGenericTable}

    </div>
  )
}

export default CommissionTable