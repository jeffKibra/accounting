import { Tbody } from '@chakra-ui/react';
import PropTypes from 'prop-types';
//
import TRow from './TRow';

export default function TBody(props) {
  // console.log({ TBodyProps: props });
  const { tableBodyProps, rows, prepareRow, onRowClick, rowProps } = props;

  return (
    <Tbody {...(tableBodyProps ? tableBodyProps : {})}>
      {rows.map((row, i) => {
        prepareRow(row);
        // console.log({ row });

        return (
          <TRow
            key={i}
            row={row}
            onClick={onRowClick}
            {...(rowProps ? rowProps : {})}
          />
        );
      })}
    </Tbody>
  );
}

TBody.propTypes = {
  tableBodyProps: PropTypes.object,
  rows: PropTypes.array,
  prepareRow: PropTypes.func,
  onRowClick: PropTypes.func,
  rowProps: PropTypes.object,
};
