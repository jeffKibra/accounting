import { useSelector, useDispatch } from 'react-redux';
import { Box, Text } from '@chakra-ui/react';

import { DELETE_BOOKING } from '../store/actions/bookingsActions';

import BookingDates from 'components/tables/Bookings/BookingDates';

import { reset } from '../store/slices/bookingsSlice';

export default function useDeleteBooking(booking) {
  const { customer, id: bookingId, item, dateRange } = booking;
  const {
    loading,
    action,
    isModified: isDeleted,
  } = useSelector(state => state.bookingsReducer);
  const dispatch = useDispatch();

  const deleting = loading && action === DELETE_BOOKING;
  console.log({ loading, action, isDeleted });

  function handleDelete() {
    dispatch({ type: DELETE_BOOKING, payload: bookingId });
  }

  function resetBooking() {
    dispatch(reset());
  }

  const details = {
    isDone: isDeleted,
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
              {item?.name}
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
              <BookingDates dateRange={dateRange || []} />
            </b>
          </Text>
        </Box>
        <Text>NOTE:::THIS ACTION CANNOT BE UNDONE!</Text>
      </Box>
    ),
  };

  return {
    deleting,
    isDeleted,
    details,
    handleDelete,
    resetBooking,
  };
}
