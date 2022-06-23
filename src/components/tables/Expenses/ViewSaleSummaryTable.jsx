import { TableContainer, Table, Tbody, Td, Tr } from "@chakra-ui/react";
import PropTypes from "prop-types";

function ViewSaleSummaryTable(props) {
  const { summary, paymentsTotal, showBalance } = props;

  const {
    subTotal,
    taxes,
    totalAmount,
    shipping,
    adjustment,
    totalTaxes,
    taxType,
  } = summary;
  let balance = totalAmount - +paymentsTotal;

  return (
    <TableContainer>
      <Table color="black" size="sm">
        <Tbody>
          <Tr>
            <Td isNumeric>Sub Total</Td>
            <Td isNumeric>
              {Number(
                taxType === "taxInclusive" ? subTotal + totalTaxes : subTotal
              ).toLocaleString()}
            </Td>
          </Tr>

          {shipping > 0 && (
            <Tr>
              <Td isNumeric>Shipping Charges </Td>
              <Td isNumeric>{Number(shipping).toLocaleString()}</Td>
            </Tr>
          )}

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

          {adjustment !== 0 && (
            <Tr>
              <Td isNumeric>Adjustments </Td>
              <Td isNumeric>{Number(adjustment).toLocaleString()}</Td>
            </Tr>
          )}

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
          {/* "#f5f4f3" */}
          {showBalance && balance > 0 && (
            <Tr bg="gray.100">
              <Td isNumeric>
                <b>Balance Due</b>
              </Td>
              <Td isNumeric>
                <b>{Number(balance).toLocaleString()}</b>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

ViewSaleSummaryTable.defaultProps = {
  paymentsTotal: 0,
  showBalance: true,
};

ViewSaleSummaryTable.propTypes = {
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
    taxType: PropTypes.string.isRequired,
  }),
  paymentsTotal: PropTypes.number,
  showBalance: PropTypes.bool,
};

export default ViewSaleSummaryTable;
