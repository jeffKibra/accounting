import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from 'react-table';

import PropTypes from 'prop-types';

//
import Table from './Table';
//
import { TablePropTypes } from './Table';
//

const rowsPerPageOptions = [2, 4, 10, 15];

const initialState = {
  pageSize: rowsPerPageOptions[0],
  pageIndex: 0,
  onRowClick: () => {},
};

function RTTable(props) {
  const {
    columns,
    data,
    caption,
    includeGlobalFilter,
    onRowClick,
    bodyRowProps,
    ...moreProps
  } = props;
  // console.log({ bodyRowProps });

  const instance = useTable(
    { columns, data, initialState },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  // console.log({ instance });

  const {
    rows,
    getTableProps,
    getTableBodyProps,
    headers,
    prepareRow,
    state: { pageIndex, pageSize, globalFilter },
    page,
    canNextPage,
    canPreviousPage,
    pageOptions,
    // pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
  } = instance;

  // console.log({ pageIndex, pageCount, pageOptions });

  function handleGlobalFilterInputChange(e) {
    const searchValue = e.target.value;
    // console.log({ searchValue });
    setGlobalFilter(searchValue);
  }

  return (
    <Table
      setGlobalFilter={handleGlobalFilterInputChange}
      itemsCount={rows?.length}
      tableProps={getTableProps()}
      tableBodyProps={getTableBodyProps()}
      headers={headers}
      prepareRow={prepareRow}
      pageIndex={pageIndex}
      pageSize={pageSize}
      globalFilter={globalFilter}
      page={page}
      canNextPage={canNextPage}
      canPreviousPage={canPreviousPage}
      pageOptions={pageOptions}
      // pageCount={pageCount}
      gotoPage={gotoPage}
      nextPage={nextPage}
      previousPage={previousPage}
      setPageSize={setPageSize}
      //
      includeGlobalFilter={includeGlobalFilter}
      bodyRowProps={bodyRowProps}
      caption={caption}
      onRowClick={onRowClick}
      {...moreProps}
    />
  );
}

export const RTTablePropTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  caption: PropTypes.string,
  includeGlobalFilter: PropTypes.bool,
  onRowClick: PropTypes.func,
  bodyRowProps: PropTypes.object,
  ...TablePropTypes,
};

RTTable.propTypes = {
  ...RTTablePropTypes,
};

export default RTTable;
