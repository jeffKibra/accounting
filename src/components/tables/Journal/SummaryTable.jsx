import {
  TableContainer,
  Table,
  Tbody,
  Thead,
  Td,
  Th,
  Tr,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

function JournalSummaryTable(props) {
  const { summary } = props;

  const { taxes, subTotal, total } = summary;

  const difference = summary?.difference || 0;
  const differenceIsDebit = difference > 0;
  const differenceCredit = differenceIsDebit ? 0 : 0 - difference;
  const differenceDebit = differenceIsDebit ? difference : 0;

  return (
    <TableContainer>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th></Th>
            <Th>Debits</Th>
            <Th>Credits</Th>
          </Tr>
        </Thead>

        <Tbody>
          <Tr>
            <Td>Sub Total</Td>
            <Td w="16%" isNumeric>
              {subTotal?.debit || 0}
            </Td>
            <Td w="16%" isNumeric>
              {subTotal?.credit || 0}
            </Td>
          </Tr>

          {taxes.map((tax, i) => {
            const { name, rate, debit, credit } = tax;
            const shouldShowValue = debit > 0 || credit > 0;

            return shouldShowValue ? (
              <Tr key={i}>
                <Td>
                  {' '}
                  {name} ({rate}%)
                </Td>
                <Td isNumeric>{debit}</Td>
                <Td isNumeric>{credit}</Td>
              </Tr>
            ) : null;
          })}

          <Tr>
            <Th>Total (KES)</Th>
            <Th fontSize="14px" w="16%" py={3} isNumeric>
              {total?.debit || 0}
            </Th>
            <Th fontSize="14px" w="16%" py={3} isNumeric>
              {total?.credit || 0}
            </Th>
          </Tr>

          <Tr>
            <Td>Difference</Td>

            <Td w="16%" color="red" py={3} isNumeric>
              {differenceDebit || ''}
            </Td>
            <Td w="16%" color="red" py={3} isNumeric>
              {differenceCredit || 0}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}

const entryShape = PropTypes.shape({
  debit: PropTypes.number.isRequired,
  credit: PropTypes.number.isRequired,
});

JournalSummaryTable.propTypes = {
  summary: PropTypes.shape({
    subTotal: entryShape,
    taxes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        rate: PropTypes.number,
        taxId: PropTypes.string,
        debit: PropTypes.number,
        credit: PropTypes.number,
      })
    ),
    totalTax: entryShape,
    total: entryShape,
  }),
};

export default JournalSummaryTable;
