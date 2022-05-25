import { TableContainer, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import PropTypes from "prop-types";

function PaymentsSummaryTable(props) {
  const { amount, payments } = props;

  return (
    <TableContainer>
      <Table size="sm">
        <Tbody>
          <Tr>
            <Td>Amount Received</Td>
            <Td isNumeric>{amount}</Td>
          </Tr>

          <Tr>
            <Td>Payments</Td>
            <Td isNumeric>{payments}</Td>
          </Tr>

          <Tr>
            <Td>Amount in Excess </Td>
            <Td isNumeric>{amount - payments}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}

PaymentsSummaryTable.propTypes = {
  amount: PropTypes.number.isRequired,
  payments: PropTypes.number.isRequired,
};

export default PaymentsSummaryTable;
