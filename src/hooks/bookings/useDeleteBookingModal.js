import { Box, Text } from '@chakra-ui/react';

//
import { BOOKINGS } from 'nav/routes';
//
import { useDeleteInvoice } from 'hooks';

import BookingDates from 'components/tables/Bookings/BookingDates';
//

export default function useDeleteBookingModal(booking) {
  const { _id: bookingId } = booking;

  const { isDeleted, loading, handleDelete, resetDelete } = useDeleteInvoice(
    bookingId,
    ['ListBookings'],
    BOOKINGS
  );

  const { title, message } = generateDeleteBookingModalDetails(booking);

  const details = {
    isDone: isDeleted,
    onConfirm: () => handleDelete(bookingId),
    // loading: deleting,
    loading,
    title,
    message,
  };

  return {
    deleting: loading,
    isDeleted,
    details,
    handleDelete,
    resetDelete,
  };
}

export function generateDeleteBookingModalDetails(booking) {
  const { customer, _id: bookingId, vehicle, startDate, endDate } = booking;

  const title = 'Delete Booking';
  const message = (
    <Box>
      <Text>Are you sure you want to delete this Booking</Text>
      <Box p={1} pl={5}>
        <Text>
          Car Registration:{' '}
          <Text as="b" textTransform="uppercase">
            {vehicle?.registration}
          </Text>
        </Text>
        <Text>
          Booking Id#: <b>{bookingId}</b>
        </Text>
        <Text>
          Customer Name: <b>{customer.displayName}</b>
        </Text>
        {/* <Text>
            Booking Dates :<b>{saleDate.toDateString()}</b>
          </Text> */}
        <Text>
          Booking Dates :
          <b>
            <BookingDates startDate={startDate} endDate={endDate} />
          </b>
        </Text>
      </Box>
      <Text>NOTE:::THIS ACTION CANNOT BE UNDONE!</Text>
    </Box>
  );

  return {
    title,
    message,
  };
}
