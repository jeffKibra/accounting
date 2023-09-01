import { useMemo } from 'react';
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
  count: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
};

Pagination.defaultProps = {
  rowsPerPage: 5,
  rowsPerPageOptions: [5, 10, 15],
  page: 1,
  onPageChange: () => {},
  onRowsPerPageChange: () => {},
};

export default function Pagination(props) {
  console.log({ props });
  const {
    rowsPerPage,
    rowsPerPageOptions,
    page,
    count,
    onPageChange,
    onRowsPerPageChange,
  } = props;

  const numberOfPages = useMemo(() => {
    return count > 0 ? Math.ceil(count / rowsPerPage) : 1;
  }, [count, rowsPerPage]);

  const prevPage = page - 1;
  const virtualFirstItem = prevPage * rowsPerPage + 1;
  const firstItem = Math.min(virtualFirstItem, count);

  const virtualLastItem = page * rowsPerPage;
  const lastItem = Math.min(virtualLastItem, count);

  function next() {
    if (page < numberOfPages) {
      onPageChange(page + 1);
    }
  }

  function prev() {
    if (page > 1) {
      onPageChange(page - 1);
    }
  }

  function handleRowsPerPageChange(incoming) {
    console.log({ incoming });
    onRowsPerPageChange(incoming);
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
        {firstItem}-{lastItem} of {count}
      </Text>

      <Box ml={4}>
        {/* <IconButton
          disabled={page === 1}
          // size="sm"
          variant="ghost"
          icon={<RiArrowLeftSLine />}
          onClick={()=>onPageChange(1)}
          fontSize="24px"
        /> */}
        <IconButton
          disabled={page <= 1}
          // size="sm"
          variant="ghost"
          icon={<RiArrowDropLeftLine />}
          onClick={prev}
          fontSize="24px"
        />
        <IconButton
          disabled={page >= numberOfPages}
          // size="sm"
          variant="ghost"
          icon={<RiArrowDropRightLine />}
          onClick={next}
          fontSize="24px"
        />
        {/* <IconButton
          disabled={page === numberOfPages}
          // size="sm"
          variant="ghost"
          icon={<RiArrowRightSLine />}
          onClick={()=>onPageChange(numberOfPages)}
          fontSize="24px"
        /> */}
      </Box>
    </Box>
  );
}
