import { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

//
import { BOOKINGS } from 'nav/routes';
//

import BookingDates from 'components/tables/Bookings/BookingDates';
//
import useToasts from '../useToasts';

import { mutations } from 'gql';

export default function useDeleteBooking(booking) {
  const { customer, _id: bookingId, vehicle, startDate, endDate } = booking;

  const navigate = useNavigate();
  const { error: toastError, success: toastSuccess } = useToasts();

  const [deleteBooking, { called, loading, error, reset }] = useMutation(
    mutations.bookings.DELETE_BOOKING,
    { refetchQueries: ['ListBookings'] }
  );

  const success = called && !loading && !error;
  const failed = called && !loading && Boolean(error);

  useEffect(() => {
    if (success) {
      toastSuccess('Booking successfully deleted!');
      //
      reset();
      //
      navigate(BOOKINGS);
    }
  }, [success, toastSuccess, reset, navigate]);

  useEffect(() => {
    if (failed) {
      toastError(error.message);
    }
  }, [failed, error, toastError]);

  function handleDelete() {
    deleteBooking({
      variables: { id: bookingId },
    });
    // dispatch({ type: DELETE_vehicle, payload: vehicleId });
  }

  const details = {
    isDone: success,
    title: 'Delete Booking',
    onConfirm: () => handleDelete(bookingId),
    // loading: deleting,
    loading,
    message: (
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
    ),
  };

  return {
    deleting: loading,
    isDeleted: success,
    details,
    handleDelete,
    resetBooking: reset,
  };
}
