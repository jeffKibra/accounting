import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  UPDATE_BOOKING,
  GET_BOOKING,
} from '../../../store/actions/bookingsActions';
import { reset } from '../../../store/slices/bookingsSlice';

import { BOOKINGS } from '../../../nav/routes';

import useSavedLocation from '../../../hooks/useSavedLocation';
import PageLayout from '../../../components/layout/PageLayout';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import BookingForm from 'components/forms/Booking/BookingForm';

function getFormValuesOnly(booking = {}) {
  const {
    customer,
    customerNotes,
    dueDate,
    saleDate,
    id,
    paymentTerm,
    // subject,
    startDate,
    endDate,
    quantity,
    bookingRate,
    bookingTotal,
    transferAmount,
    total,
    item,
    downPayment,
  } = booking;

  return {
    customer,
    customerNotes,
    dueDate,
    saleDate,
    id,
    paymentTerm,
    // subject,
    startDate,
    endDate,
    quantity,
    bookingRate,
    bookingTotal,
    transferAmount,
    total,
    item,
    downPayment,
  };
}

function EditBookingPage(props) {
  const {
    loading,
    action,
    isModified,
    booking,
    updateBooking,
    resetBooking,
    getBooking,
  } = props;
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  useSavedLocation().setLocation();
  const viewRoute = `/sale/bookings/${bookingId}/view`;

  useEffect(() => {
    getBooking(bookingId);
  }, [getBooking, bookingId]);

  useEffect(() => {
    if (isModified) {
      resetBooking();
      navigate(viewRoute);
    }
  }, [isModified, resetBooking, navigate, viewRoute]);

  function update(data) {
    updateBooking({
      ...data,
      bookingId,
    });
  }

  return (
    <PageLayout
      pageTitle="Edit Booking"
      breadcrumbLinks={{
        Dashboard: '/',
        Bookings: BOOKINGS,
        [bookingId]: location.pathname,
      }}
    >
      {loading && action === GET_BOOKING ? (
        <SkeletonLoader />
      ) : booking ? (
        <BookingForm
          updating={loading && action === UPDATE_BOOKING}
          handleFormSubmit={update}
          booking={getFormValuesOnly(booking)}
        />
      ) : (
        <Empty message="booking not found!" />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified, booking } = state.bookingsReducer;

  return { loading, action, isModified, booking };
}

function mapDispatchToProps(dispatch) {
  return {
    updateBooking: payload => dispatch({ type: UPDATE_BOOKING, payload }),
    resetBooking: () => dispatch(reset()),
    getBooking: id => dispatch({ type: GET_BOOKING, payload: id }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBookingPage);
