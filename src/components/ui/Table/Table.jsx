import { TableContainer, Table as ChakraTable } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function Table(props) {
  const { children, tableProps } = props;

  return (
    <TableContainer w="full">
      <ChakraTable
        minW="650px"
        variant="simple"
        size="sm"
        {...(tableProps ? tableProps : {})}
      >
        {children}
      </ChakraTable>
    </TableContainer>
  );
}

Table.propTypes = {
  children: PropTypes.func.isRequired,
  tableProps: PropTypes.object,
};

export default Table;
