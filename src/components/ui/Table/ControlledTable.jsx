// import { useCallback } from 'react';
import {
  TableCaption,
  TableContainer,
  Table as ChakraTable,
  Box,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { RiFilter3Line } from 'react-icons/ri';
import PropTypes from 'prop-types';

//
import { TableContextProviderPropTypes } from 'contexts/TableContext';
//
import ControlledSearchInput from 'components/ui/ControlledSearchInput';
import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';
import CustomAlert from 'components/ui/CustomAlert';
//
import THead from './THead';
import TBody from './TBody';
import Pagination from './Pagination';

function ControlledTable(props) {
  const {
    headers,
    data,
    caption,
    includeGlobalFilter,
    bodyRowProps,
    //
    tableProps,
    tableBodyProps,
    prepareRow,
    globalFilter,
    setGlobalFilter,
    //pagination props
    pageIndex,
    pageSize,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    pageCount,
    allItemsCount,
    rowsPerPageOptions,
    //
    loading,
    error,
    onSearch,
    //
    onFiltersModalOpen,
  } = props;
  // console.log({ bodyRowProps });

  // console.log('controlled table', { pageIndex, pageCount });

  const canNextPage = pageIndex < pageCount - 1;
  // console.log({ pageIndex, pageCount, canNextPage });
  const canPreviousPage = pageIndex > 0;

  return (
    <Box w="full">
      {includeGlobalFilter ? (
        <HStack mb={3} px={4}>
          <ControlledSearchInput
            id="global-filter-input"
            placeholder="Search..."
            onChange={setGlobalFilter}
            value={globalFilter || ''}
            size="sm"
            delayBeforeSearchMS={1500}
            onSearch={onSearch}
          />
          {typeof onFiltersModalOpen === 'function' ? (
            <IconButton
              size="sm"
              onClick={onFiltersModalOpen}
              title="open filters modal"
              icon={<RiFilter3Line />}
            />
          ) : null}
        </HStack>
      ) : null}

      <TableContainer w="full">
        <ChakraTable minW="650px" variant="simple" size="sm" {...tableProps}>
          <THead headers={headers} />

          {loading ? null : (
            <TBody
              tableBodyProps={tableBodyProps}
              rows={data}
              prepareRow={prepareRow}
              rowProps={{ ...(bodyRowProps ? bodyRowProps : {}) }}
            />
          )}

          {caption && <TableCaption>{caption}</TableCaption>}
        </ChakraTable>
      </TableContainer>

      {loading ? (
        <SkeletonLoader />
      ) : (
        <>
          {data?.length === 0 ? (
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
      )}

      <Box w="full" mt={2} mb={1}>
        <Pagination
          data={data || []}
          loading={loading}
          canNextPage={canNextPage}
          canPreviousPage={canPreviousPage}
          gotoPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
          pageIndex={Number(pageIndex)}
          // pageCount={pageCount}
          rowsPerPage={Number(pageSize)}
          onRowsPerPageChange={setPageSize}
          rowsPerPageOptions={rowsPerPageOptions}
          itemsCount={Number(allItemsCount) || 0}
        />
      </Box>
    </Box>
  );
}

export const ControlledTablePropTypes = {
  headers: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired, //active page data
  //
  caption: PropTypes.string,
  includeGlobalFilter: PropTypes.bool,
  bodyRowProps: PropTypes.object,
  //
  tableProps: PropTypes.object,
  tableBodyProps: PropTypes.object,
  prepareRow: PropTypes.func, //required for react-table table
  globalFilter: PropTypes.string,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  pageOptions: PropTypes.array,
  gotoPage: PropTypes.func,
  nextPage: PropTypes.func,
  previousPage: PropTypes.func,
  setPageSize: PropTypes.func,
  setGlobalFilter: PropTypes.func,
  allItemsCount: PropTypes.number,
  // pageCount:PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.object,
  //
  rowsPerPageOptions: PropTypes.array,
  onSearch: PropTypes.func,
  // onFilter: PropTypes.func,
  //
  onFiltersModalOpen: PropTypes.func,
  ...TableContextProviderPropTypes,
};

ControlledTable.propTypes = {
  ...ControlledTablePropTypes,
};

export default ControlledTable;
