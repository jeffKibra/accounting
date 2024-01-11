import { useTable } from 'react-table';
import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

function CustomRawTable(props) {
  const { columns, data, caption } = props;
  const instance = useTable({ columns, data });
  //   console.log({ instance });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    instance;

  // minW = '650px';
  return (
    <TableContainer w="full">
      <Table {...getTableProps()} width="full" variant="simple" size="sm">
        {caption && <TableCaption>{caption}</TableCaption>}
        <Thead>
          {headerGroups.map(headerGroup => {
            const { headers, getHeaderGroupProps } = headerGroup;
            return (
              <Tr {...getHeaderGroupProps()}>
                {headers.map(column => {
                  const { render, getHeaderProps } = column;
                  const { isNumeric } = column;

                  return (
                    <Th isNumeric={isNumeric} {...getHeaderProps()}>
                      {render('Header')}
                    </Th>
                  );
                })}
              </Tr>
            );
          })}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            // console.log({ row });
            const { getRowProps, cells } = row;
            return (
              <Tr {...getRowProps()}>
                {cells.map(cell => {
                  const { getCellProps, render, column } = cell;
                  // console.log(getCellProps(), { cell });
                  const { isNumeric, width } = column;

                  return (
                    <Td
                      isNumeric={isNumeric}
                      {...(width ? { width } : {})}
                      {...getCellProps()}
                    >
                      {render('Cell')}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

CustomRawTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  caption: PropTypes.string,
};

export default CustomRawTable;
