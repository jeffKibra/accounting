import {
  TableContainer,
  Table,
  // Thead,
  Th,
  Tbody,
  Tr,
  Td,
  // Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
// import { isItemABooking } from 'utils/sales';

// function checkIfDateIsValid(date) {
//   const dateIsValid = date && new Date(date).toDateString() !== 'Invalid Date';
//   console.log({ dateIsValid });

//   return dateIsValid;
// }

function ViewSaleItemTable(props) {
  const { booking } = props;

  const {
    item: { name },
    bookingRate,
    dateRange,
    quantity,
    bookingTotal,
    transferAmount,
    // taxType,
    downPayment: { amount: downPayment, paymentMode, reference },
  } = booking;

  const imprest = downPayment || 0;

  return (
    <TableContainer>
      <Table wordBreak="break-word" size="sm">
        <Tbody>
          <Tr>
            <Th>Registration</Th>
            <Td textAlign="end">{name}</Td>
          </Tr>
          <Tr>
            <Th>Rate</Th>
            <Td textAlign="end">KES {Number(bookingRate).toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Th>Start Date</Th>
            <Td textAlign="end">
              {new Date(dateRange[0] || Date.now()).toDateString()}
            </Td>
          </Tr>
          <Tr>
            <Th>End Date</Th>
            <Td textAlign="end">
              {new Date(dateRange[1] || Date.now()).toDateString()}
            </Td>
          </Tr>
          <Tr>
            <Th>Days</Th>
            <Td textAlign="end">{Number(quantity).toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Th>Booking Total</Th>
            <Td textAlign="end">
              KES {Number(bookingTotal).toLocaleString()}
              {/* {Number(
                  taxType === 'taxInclusive' ? itemRate + itemTax : itemRate
                ).toLocaleString()} */}
            </Td>
          </Tr>
          <Tr>
            <Th>Transfer Amount</Th>
            <Td textAlign="end">
              KES {Number(transferAmount).toLocaleString()}
            </Td>
          </Tr>
          <Tr>
            <Th>Imprest Given</Th>
            <Td textAlign="end">KES {Number(imprest).toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Th>Payment Mode</Th>
            <Td textAlign="end">{paymentMode?.name || ''}</Td>
          </Tr>
          <Tr>
            <Th>Reference #</Th>
            <Td textAlign="end">{reference}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}

ViewSaleItemTable.propTypes = {
  booking: PropTypes.shape({
    item: PropTypes.shape({
      name: PropTypes.string.isRequired,
      itemId: PropTypes.string.isRequired,
    }),
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
};

export default ViewSaleItemTable;
