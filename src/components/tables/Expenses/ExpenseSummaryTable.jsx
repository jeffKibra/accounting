import { TableContainer, Table, Tbody, Td, Th, Tr } from "@chakra-ui/react";
import PropTypes from "prop-types";

function ExpenseSummaryTable(props) {
  const { summary } = props;
  const { subTotal, expenseTaxes, totalAmount, totalTaxes } = summary;

  return (
    <TableContainer>
      <Table size="sm">
        <Tbody>
          {totalTaxes > 0 && (
            <Tr>
              <Td>Sub Total</Td>
              <Td isNumeric>{subTotal}</Td>
            </Tr>
          )}

          {expenseTaxes.map((tax, i) => {
            const { name, rate, totalTax } = tax;
            return (
              <Tr key={i}>
                <Td>
                  {" "}
                  {name} ({rate}%)
                </Td>
                <Td isNumeric>{totalTax}</Td>
              </Tr>
            );
          })}

          <Tr>
            <Th>Total (KES)</Th>
            <Th isNumeric>{totalAmount}</Th>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}

ExpenseSummaryTable.propTypes = {
  summary: PropTypes.shape({
    subTotal: PropTypes.number.isRequired,
    expenseTaxes: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        rate: PropTypes.number,
        taxId: PropTypes.string,
        totalTax: PropTypes.number,
      })
    ),
    totalTaxes: PropTypes.number.isRequired,
    totalAmount: PropTypes.number.isRequired,
  }),
};

export default ExpenseSummaryTable;
