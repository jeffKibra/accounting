import { useTable, useFilters, useSortBy } from 'react-table';
import { TableCaption } from '@chakra-ui/react';
import PropTypes from 'prop-types';

//
import Table from './Table';
import THead from './THead';
import TBody from './TBody';

function AdvancedTable(props) {
  const { columns, data, caption } = props;
  const instance = useTable({ columns, data }, useFilters, useSortBy);
  console.log({ instance });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    instance;

  return (
    <Table {...getTableProps()} minW="650px" variant="simple" size="sm">
      <THead headerGroups={headerGroups} />

      <TBody
        tableBodyProps={getTableBodyProps()}
        rows={rows}
        prepareRow={prepareRow}
      />

      {caption && <TableCaption>{caption}</TableCaption>}
    </Table>
  );
}

AdvancedTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  caption: PropTypes.string,
};

export default AdvancedTable;
