import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from 'react-table';
import {
  TableCaption,
  TableContainer,
  Table as ChakraTable,
  Box,
  Input,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

//
import {
  TableContextProvider,
  TableContextProviderPropTypes,
} from 'contexts/TableContext';
//
import THead from './THead';
import TBody from './TBody';
import Pagination from './Pagination';

const rowsPerPageOptions = [2, 4, 10, 15];

const initialState = {
  pageSize: rowsPerPageOptions[0],
  pageIndex: 0,
  onRowClick: () => {},
};

function Table(props) {
  const {
    columns,
    data,
    caption,
    includeGlobalFilter,
    onRowClick,
    bodyRowProps,
    rowFieldToUseAsIdForHighlighting,
    highlightedRowBGColor,
    rowIdToHighlight,
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
    headerGroups,
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
    <Box w="full">
      <TableContextProvider
        highlightedRowBGColor={highlightedRowBGColor}
        rowIdToHighlight={rowIdToHighlight || ''}
        rowFieldToUseAsIdForHighlighting={
          rowFieldToUseAsIdForHighlighting || ''
        }
      >
        {includeGlobalFilter ? (
          <Box mb={3} px={4}>
            <Input
              placeholder="Search..."
              size="sm"
              value={globalFilter}
              id="global-filter-input"
              onChange={handleGlobalFilterInputChange}
            />
          </Box>
        ) : null}

        <TableContainer w="full">
          <ChakraTable
            minW="650px"
            variant="simple"
            size="sm"
            {...getTableProps()}
          >
            <THead headerGroups={headerGroups} />

            <TBody
              tableBodyProps={getTableBodyProps()}
              rows={page}
              prepareRow={prepareRow}
              onRowClick={onRowClick}
              rowProps={{ ...(bodyRowProps ? bodyRowProps : {}) }}
            />

            {caption && <TableCaption>{caption}</TableCaption>}
          </ChakraTable>
        </TableContainer>

        <Box w="full" mt={2} mb={1}>
          <Pagination
            canNextPage={canNextPage}
            canPreviousPage={canPreviousPage}
            gotoPage={gotoPage}
            nextPage={nextPage}
            previousPage={previousPage}
            totalPages={pageOptions.length}
            pageNumber={Number(pageIndex) + 1}
            rowsPerPage={Number(pageSize)}
            onRowsPerPageChange={setPageSize}
            rowsPerPageOptions={rowsPerPageOptions}
            itemsCount={rows?.length || 0}
          />
        </Box>
      </TableContextProvider>
    </Box>
  );
}

export const TableProps = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  caption: PropTypes.string,
  includeGlobalFilter: PropTypes.bool,
  onRowClick: PropTypes.func,
  bodyRowProps: PropTypes.object,
  ...TableContextProviderPropTypes,
};

Table.propTypes = {
  ...TableProps,
};

export default Table;
