import { useMemo } from 'react';
import { TableContainer, Table, Tbody, Td, Tr } from '@chakra-ui/react';
import PropTypes from 'prop-types';
//
import { bookingProps } from 'propTypes';

function ViewSaleSummaryTable(props) {
  const { booking, showBalance } = props;
  const {
    paymentsReceived: payments,
    total,
    subTotal,
    balance,
    // downPayment: { amount: imprest },
  } = booking;
  // console.log({ payments, total, subTotal });

  const paymentsTotal = useMemo(() => {
    // console.log('payments have changed', payments);

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

          {/* <Tr>
            <Td isNumeric>
              <b>Imprest Given</b>
            </Td>
            <Td isNumeric>
              <b>(-) {Number(imprest || 0).toLocaleString()}</b>
            </Td>
          </Tr> */}

          {paymentsTotal > 0 && (
            <Tr>
              <Td isNumeric>
                <b>Other Payments</b>
              </Td>
              <Td isNumeric>
                <b>(-) {Number(paymentsTotal).toLocaleString()}</b>
              </Td>
            </Tr>
          )}
          {/* "#f5f4f3" */}
          {showBalance && (
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
  booking: bookingProps,
  showBalance: PropTypes.bool,
};

export default ViewSaleSummaryTable;
