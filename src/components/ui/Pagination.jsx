import { useState, useMemo } from 'react';
import { Box, IconButton, Text } from '@chakra-ui/react';
import {
  RiArrowRightSLine,
  RiArrowLeftSLine,
  RiArrowDropRightLine,
  RiArrowDropLeftLine,
} from 'react-icons/ri';
import PropTypes from 'prop-types';

//----------------------------------------------------------------
Pagination.propTypes = {
  itemsPerPage: PropTypes.number.isRequired,
  listLength: PropTypes.number.isRequired,
  subListLength: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

Pagination.defaultProps = {
  itemsPerPage: 5,
};

export default function Pagination(props) {
  const { itemsPerPage, subListLength, listLength, onChange } = props;
  const totalItems = listLength || 0;

  const [page, setPage] = useState(1);

  const numberOfPages = useMemo(() => {
    return totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) : 1;
  }, [totalItems, itemsPerPage]);

  const totalViewed = itemsPerPage * page;
  const firstItem = listLength ? totalViewed - (itemsPerPage - 1) : 0;
  const lastItem =
    firstItem > 0 ? firstItem + (subListLength || 0) - 1 : firstItem;

  function next() {
    if (page < numberOfPages) {
      setPage(prev => {
        const newPage = prev + 1;
        onChange(newPage);
        return newPage;
      });
    }
  }
  function prev() {
    if (page > 1) {
      setPage(prev => {
        const newPage = prev - 1;
        onChange(newPage);
        return newPage;
      });
    }
  }
  function moveToLastPage() {
    setPage(numberOfPages);
    onChange(numberOfPages);
  }
  function moveToFirstPage() {
    setPage(1);
    onChange(1);
  }

  return (
    <Box display="flex" justifyContent="flex-end">
      <Box display="flex" alignItems="center">
        <Text fontSize="14px" mr={4}>
          {firstItem}-{lastItem} of {totalItems}
        </Text>
      </Box>
      <Box>
        <IconButton
          disabled={page === 1}
          // size="sm"
          variant="ghost"
          icon={<RiArrowLeftSLine />}
          onClick={moveToFirstPage}
          fontSize="24px"
        />
        <IconButton
          disabled={page === 1}
          // size="sm"
          variant="ghost"
          icon={<RiArrowDropLeftLine />}
          onClick={prev}
          fontSize="24px"
        />
        <IconButton
          disabled={page === numberOfPages}
          // size="sm"
          variant="ghost"
          icon={<RiArrowDropRightLine />}
          onClick={next}
          fontSize="24px"
        />
        <IconButton
          disabled={page === numberOfPages}
          // size="sm"
          variant="ghost"
          icon={<RiArrowRightSLine />}
          onClick={moveToLastPage}
          fontSize="24px"
        />
      </Box>
    </Box>
  );
}
