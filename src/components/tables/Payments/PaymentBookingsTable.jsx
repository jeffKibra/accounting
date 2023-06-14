import {
  TableContainer,
  Table,
  Thead,
  Th,
  Tbody,
  Tr,
  Td,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
//
import BookingDates from 'components/tables/Bookings/BookingDates';

function PaymentBookingsTable(props) {
  const { payments, bookings } = props;

  return (
    <>
      <TableContainer>
        <Table size="sm" wordBreak="break-word">
          <Thead textTransform="capitalize">
            <Tr fontSize="14px" color="black" bg="gray.100" py={2}>
              <Th
                w="5%"
                textTransform="inherit"
                color="inherit"
                fontSize="inherit"
                py={2}
              >
                Car
              </Th>

              <Th
                fontSize="inherit"
                textTransform="inherit"
                color="inherit"
                py={2}
              >
                Booking Dates
              </Th>
              <Th
                fontSize="inherit"
                textTransform="inherit"
                color="inherit"
                py={2}
              >
                Days
              </Th>
              <Th
                w="11%"
                textTransform="inherit"
                color="inherit"
                py={2}
                isNumeric
                fontSize="inherit"
              >
                Total
              </Th>
              <Th
                w="11%"
                textTransform="inherit"
                color="inherit"
                py={2}
                isNumeric
                fontSize="inherit"
              >
                Payment Amount
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {bookings.map((booking, i) => {
              const {
                id: bookingId,
                item: { name },
                total,
                dateRange,
                quantity,
                // transactionType,
              } = booking;

              return (
                <Tr key={i}>
                  {/* <Td>
                    {transactionType === 'booking'
                      ? bookingId
                      : transactionType}
                  </Td> */}

                  <Td>{name}</Td>
                  <Td>
                    <BookingDates dateRange={dateRange || []} />
                  </Td>
                  <Td>{quantity}</Td>
                  <Td isNumeric>{Number(total).toLocaleString()}</Td>
                  <Td isNumeric>
                    {Number(payments[bookingId]).toLocaleString()}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

PaymentBookingsTable.propTypes = {
  payments: PropTypes.object.isRequired,
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      bookingDate: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.string,
      ]).isRequired,
      total: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      bookingTotal: PropTypes.number.isRequired,
    })
  ),
};

export default PaymentBookingsTable;
