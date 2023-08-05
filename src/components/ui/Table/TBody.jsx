import { Tbody, Tr, Td } from '@chakra-ui/react';
import PropTypes from 'prop-types';

export default function TBody(props) {
  const { tableBodyProps, rows, prepareRow } = props;

  return (
    <Tbody {...(tableBodyProps ? tableBodyProps : {})}>
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
  );
}

TBody.propTypes = {
  tableBodyProps: PropTypes.object,
  rows: PropTypes.array,
  prepareRow: PropTypes.func,
};
