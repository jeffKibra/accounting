import { useEffect } from 'react';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from 'react-table';

import PropTypes from 'prop-types';

//
import ControlledTable from './ControlledTable';
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
    onRowClick,
    bodyRowProps,
    onSortByChange,
    onSearch,
    ...moreProps
  } = props;
  // console.log('RTTable', data);
  // console.log({ bodyRowProps });

  const manualSortBy = typeof onSortByChange === 'function';
  const manualGlobalFilter = typeof onSearch === 'function';

  // console.log({
  //   manualSortBy,
  //   manualGlobalFilter,
  // });

  const includeGlobalFilter = props.includeGlobalFilter || manualGlobalFilter;

  const instance = useTable(
    {
      columns,
      data,
      initialState,
      manualSortBy,
      manualGlobalFilter,
    },
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
    state,
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
  // console.log({ state });

  const { pageIndex, pageSize, globalFilter, sortBy } = state;

  useEffect(() => {
    if (manualSortBy) {
      console.log('sort by has changed... handling it manualy');
      onSortByChange(sortBy);
    }
  }, [sortBy, manualSortBy, onSortByChange]);

  // console.log({ pageIndex, pageCount, pageOptions });

  function handleGlobalFilterInputChange(valueToSearch) {
    // console.log({ valueToSearch });
    setGlobalFilter(valueToSearch);
    // typeof onSearch === 'function' && onSearch(valueToSearch);
  }

  return (
    <ControlledTable
      setGlobalFilter={handleGlobalFilterInputChange}
      itemsCount={rows?.length}
      tableProps={getTableProps()}
      tableBodyProps={getTableBodyProps()}
      headers={headers}
      prepareRow={prepareRow}
      pageIndex={pageIndex}
      pageSize={pageSize}
      globalFilter={globalFilter}
      pageData={page}
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
      rowsPerPageOptions={rowsPerPageOptions}
      onSearch={onSearch}
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
  onSortByChange: PropTypes.func,
  onSearch: PropTypes.func,
};

RTTable.propTypes = {
  ...RTTablePropTypes,
};

export default RTTable;
