import {
  TableCaption,
  TableContainer,
  Table as ChakraTable,
  Box,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

//
import {
  TableContextProvider,
  TableContextProviderPropTypes,
} from 'contexts/TableContext';
//
import ControlledSearchInput from 'components/ui/ControlledSearchInput';
//
import Empty from '../Empty';
import CustomAlert from '../CustomAlert';
//
import THead from './THead';
import TBody from './TBody';
import Pagination from './Pagination';

function ControlledTable(props) {
  const {
    headers,
    pageData, //active page data
    caption,
    includeGlobalFilter,
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
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    pageCount,
    itemsCount,
    rowsPerPageOptions,
    //
    error,
    onSearch,
    onRowClick,
  } = props;
  // console.log({ bodyRowProps });

  // console.log({ pageIndex, pageCount, pageOptions });

  return (
    <Box w="full">
      <TableContextProvider
        onRowClick={onRowClick}
        highlightedRowBGColor={highlightedRowBGColor}
        rowIdToHighlight={rowIdToHighlight || ''}
        rowFieldToUseAsIdForHighlighting={
          rowFieldToUseAsIdForHighlighting || ''
        }
      >
        {includeGlobalFilter ? (
          <Box mb={3} px={4}>
            <ControlledSearchInput
              id="global-filter-input"
              placeholder="Search..."
              onChange={setGlobalFilter}
              value={globalFilter || ''}
              size="sm"
              delayBeforeSearchMS={1500}
              onSearch={onSearch}
            />
          </Box>
        ) : null}

        <TableContainer w="full">
          <ChakraTable minW="650px" variant="simple" size="sm" {...tableProps}>
            <THead headers={headers} />

            <TBody
              tableBodyProps={tableBodyProps}
              rows={pageData}
              prepareRow={prepareRow}
              onRowClick={onRowClick}
              rowProps={{ ...(bodyRowProps ? bodyRowProps : {}) }}
            />

            {caption && <TableCaption>{caption}</TableCaption>}
          </ChakraTable>
        </TableContainer>

        <>
          {pageData?.length === 0 ? (
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
        </>

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
            pageCount={pageCount}
          />
        </Box>
      </TableContextProvider>
    </Box>
  );
}

export const ControlledTablePropTypes = {
  headers: PropTypes.array.isRequired,
  pageData: PropTypes.array.isRequired, //active page data
  //
  caption: PropTypes.string,
  includeGlobalFilter: PropTypes.bool,
  onRowClick: PropTypes.func,
  bodyRowProps: PropTypes.object,
  //
  tableProps: PropTypes.object,
  tableBodyProps: PropTypes.object,
  prepareRow: PropTypes.func, //required for react-table table
  globalFilter: PropTypes.string,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
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
  onSearch: PropTypes.func,
  ...TableContextProviderPropTypes,
};

ControlledTable.propTypes = {
  ...ControlledTablePropTypes,
};

export default ControlledTable;
