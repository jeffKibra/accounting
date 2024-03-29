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
//i
import Empty from '../Empty';
import CustomAlert from '../CustomAlert';
//
import THead from './THead';
import TBody from './TBody';
import Pagination from './Pagination';

function ControlledTable(props) {
  const {
    headers,
    caption,
    includeGlobalFilter,
    onRowClick,
    bodyRowProps,
    rowFieldToUseAsIdForHighlighting,
    highlightedRowBGColor,
    rowIdToHighlight,
    //
    tableProps,
    tableBodyProps,
    prepareRow, //required for react-table table
    globalFilter,
    pageIndex,
    pageSize,
    page, //active page data
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    // pageCount,
    itemsCount,
    rowsPerPageOptions,
    //
    error,
  } = props;
  // console.log({ bodyRowProps });

  // console.log({ pageIndex, pageCount, pageOptions });

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
              value={globalFilter || ''}
              id="global-filter-input"
              onChange={setGlobalFilter}
            />
          </Box>
        ) : null}

        <TableContainer w="full">
          <ChakraTable minW="650px" variant="simple" size="sm" {...tableProps}>
            <THead headers={headers} />

            <TBody
              tableBodyProps={tableBodyProps}
              rows={page}
              prepareRow={prepareRow}
              onRowClick={onRowClick}
              rowProps={{ ...(bodyRowProps ? bodyRowProps : {}) }}
            />

            {caption && <TableCaption>{caption}</TableCaption>}
          </ChakraTable>
        </TableContainer>

        {page?.length === 0 ? (
          error ? (
            <CustomAlert
              status="error"
              title="Error loading data!"
              description={`${error?.code || ''} ${
                error?.message || 'Unknown Error!'
              }`}
            />
          ) : (
            <Empty message="No Data!" />
          )
        ) : null}

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
            itemsCount={Number(itemsCount) || 0}
          />
        </Box>
      </TableContextProvider>
    </Box>
  );
}

export const ControlledTablePropTypes = {
  caption: PropTypes.string,
  includeGlobalFilter: PropTypes.bool,
  onRowClick: PropTypes.func,
  bodyRowProps: PropTypes.object,
  //
  tableProps: PropTypes.object,
  tableBodyProps: PropTypes.object,
  headers: PropTypes.array,
  prepareRow: PropTypes.func, //required for react-table table
  globalFilter: PropTypes.string,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  page: PropTypes.array.isRequired, //active page data
  canNextPage: PropTypes.bool,
  canPreviousPage: PropTypes.bool,
  pageOptions: PropTypes.array,
  gotoPage: PropTypes.func,
  nextPage: PropTypes.func,
  previousPage: PropTypes.func,
  setPageSize: PropTypes.func,
  setGlobalFilter: PropTypes.func,
  // pageCount:PropTypes.number,
  //
  itemsCount: PropTypes.number,
  rowsPerPageOptions: PropTypes.array,
  ...TableContextProviderPropTypes,
};

ControlledTable.propTypes = {
  ...ControlledTablePropTypes,
};

export default ControlledTable;
