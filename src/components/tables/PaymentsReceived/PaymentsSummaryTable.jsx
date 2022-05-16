import { TableContainer, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import PropTypes from "prop-types";

function PaymentsSummaryTable(props) {
  const { summary } = props;

  const { amount, payments, excess } = summary;
  // console.log({ summary });

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
            <Td isNumeric>{excess}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}

PaymentsSummaryTable.propTypes = {
  summary: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    payments: PropTypes.number.isRequired,
    excess: PropTypes.number.isRequired,
  }),
};

export default PaymentsSummaryTable;
