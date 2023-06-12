import { useSelector, useDispatch } from 'react-redux';
import { Box, Text } from '@chakra-ui/react';

import { DELETE_BOOKING } from '../store/actions/bookingsActions';

import { reset } from '../store/slices/bookingsSlice';

export default function useDeleteBooking(booking) {
  const { customer, bookingId, saleDate, item } = booking;
  const {
    loading,
    action,
    isModified: isDeleted,
  } = useSelector(state => state.bookingsReducer);
  const dispatch = useDispatch();

  const deleting = loading && action === DELETE_BOOKING;

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
    loading: deleting,
    message: (
      <Box>
        <Text>Are you sure you want to delete this Booking</Text>
        <Box p={1} pl={5}>
          <Text>
            Registration: <b>{item?.name}</b>
          </Text>
          <Text>
            BookingId#: <b>{bookingId}</b>
          </Text>
          <Text>
            Customer Name: <b>{customer.displayName}</b>
          </Text>
          <Text>
            booking Date :<b>{saleDate.toDateString()}</b>
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
