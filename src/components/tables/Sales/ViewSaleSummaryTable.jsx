import { useMemo } from 'react';
import { TableContainer, Table, Tbody, Td, Tr } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function ViewSaleSummaryTable(props) {
  const { booking, showBalance } = props;
  const { paymentsReceived: payments, total, subTotal, balance } = booking;
  console.log({ payments, total, subTotal });

  const paymentsTotal = useMemo(() => {
    console.log('payments have changed', payments);

    let total = 0;

    if (payments && typeof payments === 'object') {
      Object.values(payments).forEach(payment => {
        total += Number(payment);
      });
    }

    return total;
  }, [payments]);

  // let balance = totalAmount - +paymentsTotal;

  return (
    <TableContainer>
      <Table color="black" size="sm">
        <Tbody>
          <Tr>
            <Td isNumeric>Sub Total</Td>
            <Td isNumeric>
              {/* {Number(
                taxType === 'taxInclusive' ? subTotal + totalTax : subTotal
              ).toLocaleString()} */}
              {Number(subTotal).toLocaleString()}
            </Td>
          </Tr>

          {/* {taxes.map((tax, i) => {
            const { name, rate, totalTax } = tax;
            return (
              <Tr key={i}>
                <Td isNumeric>
                  {' '}
                  {name} ({rate}%)
                </Td>
                <Td isNumeric>{Number(totalTax).toLocaleString()}</Td>
              </Tr>
            );
          })} */}

          <Tr>
            <Td isNumeric>
              <b>Total</b>
            </Td>
            <Td isNumeric>
              <b>{Number(total).toLocaleString()}</b>
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
  booking: PropTypes.shape({
    salesTax: PropTypes.oneOfType([
      PropTypes.shape({
        name: PropTypes.string,
        rate: PropTypes.number,
        taxId: PropTypes.string,
      }),
      PropTypes.string,
    ]),
    bookingRate: PropTypes.number.isRequired,
    bookingTotal: PropTypes.number.isRequired,
    transferAmount: PropTypes.number.isRequired,
    subTotal: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    // itemTax: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    taxType: PropTypes.string,
  }),
  showBalance: PropTypes.bool,
};

export default ViewSaleSummaryTable;
