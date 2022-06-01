import { TableContainer, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import PropTypes from "prop-types";

function InvoicePdfSummary(props) {
  const { summary, payments } = props;
  const paymentsTotal = Object.keys(payments).reduce((sum, key) => {
    return sum + +payments[key].paymentAmount;
  }, 0);

  const { subTotal, taxes, totalAmount, shipping, adjustment } = summary;

  return (
    <TableContainer>
      <Table color="black" size="sm">
        <Tbody>
          <Tr>
            <Td isNumeric>Sub Total</Td>
            <Td isNumeric>{Number(subTotal).toLocaleString()}</Td>
          </Tr>

          <Tr>
            <Td isNumeric>Shipping Charges </Td>

            <Td isNumeric>{Number(shipping).toLocaleString()}</Td>
          </Tr>

          {taxes.map((tax, i) => {
            const { name, rate, totalTax } = tax;
            return (
              <Tr key={i}>
                <Td isNumeric>
                  {" "}
                  {name} ({rate}%)
                </Td>
                <Td isNumeric>{Number(totalTax).toLocaleString()}</Td>
              </Tr>
            );
          })}

          <Tr>
            <Td isNumeric>Adjustments </Td>
            <Td isNumeric>{Number(adjustment).toLocaleString()}</Td>
          </Tr>

          <Tr>
            <Td isNumeric>
              <b>Total</b>
            </Td>
            <Td isNumeric>
              <b>{Number(totalAmount).toLocaleString()}</b>
            </Td>
          </Tr>
          {paymentsTotal > 0 && (
            <Tr>
              <Td isNumeric>
                <b>Payments</b>
              </Td>
              <Td isNumeric>
                <b>(-) {Number(paymentsTotal).toLocaleString()}</b>
              </Td>
            </Tr>
          )}
          <Tr bg="#f5f4f3">
            <Td isNumeric>
              <b>Balance Due</b>
            </Td>
            <Td isNumeric>
              <b>{Number(totalAmount - paymentsTotal).toLocaleString()}</b>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}

InvoicePdfSummary.propTypes = {
  summary: PropTypes.shape({
    subTotal: PropTypes.number,
    taxes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        rate: PropTypes.number,
        taxId: PropTypes.string,
        totalTax: PropTypes.number,
      })
    ),
    shipping: PropTypes.number.isRequired,
    adjustment: PropTypes.number.isRequired,
    totalTaxes: PropTypes.number,
    totalAmount: PropTypes.number,
  }),
  payments: PropTypes.object.isRequired,
};

export default InvoicePdfSummary;
