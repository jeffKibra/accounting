import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from 'react-table';
import { TableCaption, Box, Input } from '@chakra-ui/react';
import PropTypes from 'prop-types';

//

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
    useGlobalFilter,
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

  console.log({ globalFilter, setGlobalFilter });
  // console.log({ pageIndex, pageCount, pageOptions });

  function handleGlobalFilterInputChange(e) {
    const searchValue = e.target.value;
    console.log({ searchValue });
    setGlobalFilter(searchValue);
  }

  return (
    <Box w="full">
      <Box mb={3} px={4}>
        <Input
          placeholder="Search..."
          size="sm"
          value={globalFilter}
          id="global-filter-input"
          onChange={handleGlobalFilterInputChange}
        />
      </Box>

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
