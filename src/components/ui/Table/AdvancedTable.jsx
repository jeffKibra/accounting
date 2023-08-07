import { useTable, useFilters, useSortBy, usePagination } from 'react-table';
import { TableCaption, Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';

//
import Table from './Table';
import THead from './THead';
import TBody from './TBody';
import Pagination from './Pagination';

const rowsPerPageOptions = [2, 4, 10, 15];

const initialState = {
  pageSize: rowsPerPageOptions[0],
  pageIndex: 0,
};

function AdvancedTable(props) {
  const { columns, data, caption } = props;
  const instance = useTable(
    { columns, data, initialState },
    useFilters,
    useSortBy,
    usePagination
  );
  console.log({ instance });
  const {
    rows,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state: { pageIndex, pageSize },
    page,
    canNextPage,
    canPreviousPage,
    pageOptions,
    // pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = instance;

  // console.log({ pageIndex, pageCount, pageOptions });

  return (
    <Box w="full">
      <Table {...getTableProps()} minW="650px" variant="simple" size="sm">
        <THead headerGroups={headerGroups} />

        <TBody
          tableBodyProps={getTableBodyProps()}
          rows={page}
          prepareRow={prepareRow}
        />

        {caption && <TableCaption>{caption}</TableCaption>}
      </Table>

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
    </Box>
  );
}

AdvancedTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  caption: PropTypes.string,
};

export default AdvancedTable;
