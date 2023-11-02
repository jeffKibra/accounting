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
// import { isItemABooking } from 'utils/sales';
//
import { bookingProps } from 'propTypes';

// function checkIfDateIsValid(date) {
//   const dateIsValid = date && new Date(date).toDateString() !== 'Invalid Date';
//   console.log({ dateIsValid });

//   return dateIsValid;
// }

function ViewSaleItemTable(props) {
  const { booking } = props;

  const {
    vehicle: { registration },
    bookingRate,
    startDate,
    endDate,
    selectedDates,
    bookingTotal,
    transferFee,
    // taxType,
    downPayment: { amount: downPayment, paymentMode, reference },
  } = booking;

  const quantity = selectedDates?.length || 0;

  const imprest = downPayment || 0;

  return (
    <TableContainer>
      <Table wordBreak="break-word" size="sm">
        <Tbody>
          <Tr>
            <Th>Registration</Th>
            <Td textAlign="end">{registration}</Td>
          </Tr>
          <Tr>
            <Th>Rate</Th>
            <Td textAlign="end">KES {Number(bookingRate).toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Th>Pickup Date</Th>
            <Td textAlign="end">{new Date(startDate).toDateString()}</Td>
          </Tr>
          <Tr>
            <Th>Return Date</Th>
            <Td textAlign="end">{new Date(endDate).toDateString()}</Td>
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
            <Th>Transfer Fee</Th>
            <Td textAlign="end">KES {Number(transferFee).toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Th>Imprest Given</Th>
            <Td textAlign="end">KES {Number(imprest).toLocaleString()}</Td>
          </Tr>
          <Tr>
            <Th>Imprest Payment Mode</Th>
            <Td textAlign="end">{paymentMode?.name || ''}</Td>
          </Tr>
          <Tr>
            <Th>Imprest Reference #</Th>
            <Td textAlign="end">{reference}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}

ViewSaleItemTable.propTypes = {
  booking: bookingProps,
};

export default ViewSaleItemTable;
