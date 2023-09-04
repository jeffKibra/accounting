import { Box, IconButton, Text } from '@chakra-ui/react';
import {
  // RiArrowRightSLine,
  // RiArrowLeftSLine,
  RiArrowDropRightLine,
  RiArrowDropLeftLine,
} from 'react-icons/ri';
import PropTypes from 'prop-types';
//
import ControlledSelect from 'components/ui/ControlledSelect';

//----------------------------------------------------------------
Pagination.propTypes = {
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
  itemsCount: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
  canNextPage: PropTypes.bool,
  canPreviousPage: PropTypes.bool,
  gotoPage: PropTypes.func.isRequired,
  nextPage: PropTypes.func.isRequired,
  previousPage: PropTypes.func.isRequired,
  pageCount: PropTypes.number.isRequired,
  pageNumber: PropTypes.number.isRequired,
};

// Pagination.defaultProps = {

// };

export default function Pagination(props) {
  // console.log({ props });
  const {
    rowsPerPage,
    rowsPerPageOptions,
    onRowsPerPageChange,
    itemsCount,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    pageNumber,
    pageCount,
    // gotoPage,
  } = props;

  const prevPage = pageNumber - 1;
  const virtualFirstItem = prevPage * rowsPerPage + 1;
  const firstItem = Math.min(virtualFirstItem, itemsCount);

  const virtualLastItem = pageNumber * rowsPerPage;
  const lastItem = Math.min(virtualLastItem, itemsCount);

  function handleRowsPerPageChange(incoming) {
    // console.log({ incoming });
    onRowsPerPageChange(Number(incoming));
  }

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      width="full"
    >
      <Text fontSize="14px">Rows per page: </Text>

      <Box ml={1} mr={4}>
        <ControlledSelect
          options={rowsPerPageOptions.map(rowsPerPageOption => ({
            name: String(rowsPerPageOption),
            value: String(rowsPerPageOption),
          }))}
          value={String(rowsPerPage)}
          onChange={handleRowsPerPageChange}
          width="fit-content"
          outline="none"
          border="none"
          size="sm"
          allowClearSelection={false}
          sortDirection="desc"
        />
      </Box>

      <Text fontSize="14px">
        {firstItem}-{lastItem} of {itemsCount}
      </Text>

      <Box ml={4}>
        {/* <IconButton
          disabled={!canPreviousPage}
          // size="sm"
          variant="ghost"
          icon={<RiArrowLeftSLine />}
          onClick={() => gotoPage(1)}
          fontSize="24px"
        /> */}
        <IconButton
          disabled={!canPreviousPage}
          // size="sm"
          variant="ghost"
          icon={<RiArrowDropLeftLine />}
          onClick={previousPage}
          fontSize="24px"
        />
        <IconButton
          disabled={!canNextPage}
          // size="sm"
          variant="ghost"
          icon={<RiArrowDropRightLine />}
          onClick={nextPage}
          fontSize="24px"
        />
        {/* <IconButton
          disabled={!canNextPage}
          // size="sm"
          variant="ghost"
          icon={<RiArrowRightSLine />}
          onClick={() => gotoPage(numberOfPages)}
          fontSize="24px"
        /> */}
      </Box>
    </Box>
  );
}
