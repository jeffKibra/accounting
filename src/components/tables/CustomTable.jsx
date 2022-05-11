import { useTable } from "react-table";
import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import PropTypes from "prop-types";

function CustomTable(props) {
  const { columns, data, caption } = props;
  const instance = useTable({ columns, data });
  //   console.log({ instance });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    instance;

  return (
    <TableContainer w="full" bg="white" borderRadius="md" shadow="md" p={4}>
      <Table {...getTableProps()} minW="650px" variant="simple" size="sm">
        {caption && <TableCaption>{caption}</TableCaption>}
        <Thead>
          {headerGroups.map((headerGroup) => {
            const { headers, getHeaderGroupProps } = headerGroup;
            return (
              <Tr {...getHeaderGroupProps()}>
                {headers.map((column) => {
                  const { render, getHeaderProps } = column;

                  return <Th {...getHeaderProps()}>{render("Header")}</Th>;
                })}
              </Tr>
            );
          })}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            // console.log({ row });
            const { getRowProps, cells } = row;

            return (
              <Tr {...getRowProps()}>
                {cells.map((cell) => {
                  const { getCellProps, render } = cell;

                  return <Td {...getCellProps()}>{render("Cell")}</Td>;
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

CustomTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  caption: PropTypes.string,
};

export default CustomTable;
