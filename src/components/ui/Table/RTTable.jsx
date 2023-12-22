import { useEffect } from 'react';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  // usePagination,
} from 'react-table';

import PropTypes from 'prop-types';

//
import {
  TableContextProvider,
  TableContextProviderPropTypes,
} from 'contexts/TableContext';

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
    bodyRowProps,
    onSort,
    onSearch,
    onFilter,
    loading,
    error,
    //pagination props
    pageIndex,
    pageCount,
    gotoPage,
    pageSize,
    setPageSize,
    allItemsCount,
    //table context props
    onRowClick,
    highlightedRowBGColor,
    rowIdToHighlight,
    rowFieldToUseAsIdForHighlighting,
    ...moreProps
  } = props;
  // console.log({ moreProps });
  // console.log({ onFilter });
  // console.log('RTTable', data);
  // console.log({ bodyRowProps });

  // useEffect(() => {
  //   console.log('RTTable-data has changed', data);
  // }, [data]);
  // useEffect(() => {
  //   console.log('RTTable-columns has changed', columns);
  // }, [columns]);

  const manualSortBy = typeof onSort === 'function';
  const manualGlobalFilter = typeof onSearch === 'function';

  // console.log({
  //   manualSortBy,
  //   manualGlobalFilter,
  // });

  const includeGlobalFilter = props.includeGlobalFilter || manualGlobalFilter;
  // console.log({ includeGlobalFilter, manualGlobalFilter, onSearch });

  const instance = useTable(
    {
      columns,
      data,
      initialState,
      manualGlobalFilter,
      manualSortBy,
      autoResetSortBy: manualSortBy,
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );
  // console.log({ instance });

  const {
    rows,
    getTableProps,
    getTableBodyProps,
    headers,
    prepareRow,
    state,
    pageOptions,
    // pageCount,
    setGlobalFilter,
  } = instance;
  // console.log({ state });

  const { globalFilter, sortBy: sortByArray } = state;
  const sortBy = sortByArray[0] || {};
  //
  const sortByField = sortBy?.id || '';
  const sortByDirection = sortBy?.desc ? 'desc' : 'asc';

  useEffect(() => {
    // console.log('sort by has changed... ');

    if (manualSortBy) {
      // console.log('handling sortBy manualy');
      onSort(sortByField, sortByDirection);
    }
  }, [sortByField, sortByDirection, onSort, manualSortBy]);

  // console.log({ pageIndex, pageCount, pageOptions });

  return (
    <TableContextProvider
      onRowClick={onRowClick}
      highlightedRowBGColor={highlightedRowBGColor}
      rowIdToHighlight={rowIdToHighlight || ''}
      rowFieldToUseAsIdForHighlighting={rowFieldToUseAsIdForHighlighting || ''}
    >
      <ControlledTable
        headers={headers}
        data={rows}
        prepareRow={prepareRow}
        setGlobalFilter={setGlobalFilter}
        itemsCount={rows?.length}
        tableProps={getTableProps()}
        tableBodyProps={getTableBodyProps()}
        //pagination props
        allItemsCount={allItemsCount}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageOptions={pageOptions}
        pageCount={pageCount}
        gotoPage={gotoPage}
        setPageSize={setPageSize}
        rowsPerPageOptions={rowsPerPageOptions}
        //
        includeGlobalFilter={includeGlobalFilter}
        globalFilter={globalFilter}
        bodyRowProps={bodyRowProps}
        caption={caption}
        onRowClick={onRowClick}
        onSearch={onSearch}
        onFilter={onFilter}
        //
        loading={loading}
        error={error}
        {...moreProps}
      />
    </TableContextProvider>
  );
}

export const RTTablePropTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  caption: PropTypes.string,
  includeGlobalFilter: PropTypes.bool,
  bodyRowProps: PropTypes.object,
  onSort: PropTypes.func,
  onSearch: PropTypes.func,
  onFilter: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.object,
  //pagination props
  pageIndex: PropTypes.number,
  pageCount: PropTypes.number,
  gotoPage: PropTypes.func,
  nextPage: PropTypes.func,
  previousPage: PropTypes.func,
  pageSize: PropTypes.number,
  setPageSize: PropTypes.func,
  allItemsCount: PropTypes.number,
  //
  onFiltersModalOpen: PropTypes.func,
  //tableContext props
  ...TableContextProviderPropTypes,
};

RTTable.propTypes = {
  ...RTTablePropTypes,
};

RTTable.defaultProps = {
  gotoPage: () => {},
  setPageSize: () => {},
  onRowClick: () => {},
  // onSearch: () => {},
  onSort: () => {},
};

export default RTTable;
