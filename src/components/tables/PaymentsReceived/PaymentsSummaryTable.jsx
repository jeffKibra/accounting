import { TableContainer, Table, Tbody, Td, Tr } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';

function PaymentsSummaryTable(props) {
  const { amount, allocationsTotal } = props;

  const excess = new BigNumber(amount).minus(allocationsTotal).dp(2).toNumber();

  return (
    <TableContainer>
      <Table size="sm">
        <Tbody>
          <Tr>
            <Td>Amount Received</Td>
            <Td isNumeric>{Number(amount).toLocaleString()}</Td>
          </Tr>

          <Tr>
            <Td>Payments</Td>
            <Td isNumeric>{Number(allocationsTotal).toLocaleString()}</Td>
          </Tr>

          <Tr>
            <Td>Amount in Excess </Td>
            <Td isNumeric>{Number(excess).toLocaleString()}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}

PaymentsSummaryTable.propTypes = {
  amount: PropTypes.number.isRequired,
  allocationsTotal: PropTypes.number.isRequired,
};

export default PaymentsSummaryTable;
