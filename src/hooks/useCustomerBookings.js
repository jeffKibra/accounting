import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  GET_CUSTOMER_UNPAID_BOOKINGS,
  GET_PAYMENT_BOOKINGS_TO_EDIT,
} from 'store/actions/bookingsActions';

export default function useCustomerBookings() {
  const dispatch = useDispatch();

  const bookingsReducer = useSelector(state => state.bookingsReducer);
  // console.log({ bookingsReducer });
  const { loading, action, bookings, error } = bookingsReducer;
  // console.log({ error });

  const loadingBookings =
    loading &&
    (action === GET_CUSTOMER_UNPAID_BOOKINGS ||
      action === GET_PAYMENT_BOOKINGS_TO_EDIT);

  const getBooking = useCallback(
    customerId => {
      // console.log('fetching bookings');
      dispatch({ type: GET_CUSTOMER_UNPAID_BOOKINGS, payload: customerId });
    },
    [dispatch]
  );

  const getBookingToEdit = useCallback(
    (customerId, paymentId) => {
      // console.log('fetch bookings to edit');
      dispatch({
        type: GET_PAYMENT_BOOKINGS_TO_EDIT,
        payload: { customerId, paymentId },
      });
    },
    [dispatch]
  );

  return {
    getBooking,
    getBookingToEdit,
    loading: loadingBookings,
    action,
    bookings,
    error,
  };
}
