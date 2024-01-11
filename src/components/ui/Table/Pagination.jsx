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
  // pageCount: PropTypes.number.isRequired,
  pageIndex: PropTypes.number.isRequired,
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
    pageIndex,
    loading,
    data,
    // gotoPage,
  } = props;
  // console.log('Pagination loading:', loading);

  const pageNumber = pageIndex + 1; //since page index is zero based
  // const prevPage = pageNumber - 1;
  const prevPage = pageIndex;
  const virtualFirstItemNumber = prevPage * rowsPerPage + 1;
  const firstItemNumber = Math.min(virtualFirstItemNumber, itemsCount);
  // console.log({
  //   virtualFirstItemNumber,
  //   firstItemNumber,
  //   prevPage,
  //   pageNumber,
  // });

  const virtualLastItemNumber = pageNumber * rowsPerPage;
  const lastItemNumber = Math.min(virtualLastItemNumber, itemsCount);
  // console.log({ virtualLastItemNumber, lastItemNumber });

  function handleRowsPerPageChange(incoming) {
    // console.log({ incoming });
    onRowsPerPageChange(Number(incoming));
  }

  const firstItem = data[0]?.original;
  const lastItem = data[data.length - 1]?.original;

  const onRowsPerPageChangeIsValid = typeof onRowsPerPageChange === 'function';
  // console.log({ onRowsPerPageChangeIsValid, onRowsPerPageChange });

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
          isDisabled={!onRowsPerPageChangeIsValid}
        />
      </Box>

      <Text fontSize="14px">
        {firstItemNumber}-{lastItemNumber} of {itemsCount}
      </Text>

      <Box ml={4}>
        {/* <IconButton
          disabled={!canPreviousPage||loading}
          // size="sm"
          variant="ghost"
          icon={<RiArrowLeftSLine />}
          onClick={() => gotoPage(1)}
          fontSize="24px"
        /> */}
        <IconButton
          disabled={!canPreviousPage || loading}
          // size="sm"
          variant="ghost"
          icon={<RiArrowDropLeftLine />}
          onClick={() => previousPage(pageIndex, firstItem)}
          fontSize="24px"
        />
        <IconButton
          disabled={!canNextPage || loading}
          // size="sm"
          variant="ghost"
          icon={<RiArrowDropRightLine />}
          onClick={() => nextPage(pageIndex, lastItem)}
          fontSize="24px"
        />
        {/* <IconButton
          disabled={!canNextPage||loading}
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
