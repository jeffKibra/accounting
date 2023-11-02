import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import BookingOptions from '../../../containers/Management/Bookings/BookingOptions';

import { GET_BOOKING } from '../../../store/actions/bookingsActions';
import { reset } from '../../../store/slices/bookingsSlice';

import { BOOKINGS } from '../../../nav/routes';

import { useSavedLocation, useGetBooking } from 'hooks';

import PageLayout from '../../../components/layout/PageLayout';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import ViewBooking from '../../../containers/Management/Bookings/ViewBooking';

function ViewBookingPage(props) {
  const { isModified, resetBooking } = props;
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  useSavedLocation().setLocation();

  const { booking, loading } = useGetBooking(bookingId);

  useEffect(() => {
    if (isModified) {
      resetBooking();
      navigate(BOOKINGS);
    }
  }, [isModified, resetBooking, navigate]);

  return (
    <PageLayout
      pageTitle="Booking Details"
      actions={
        booking && <BookingOptions booking={booking} edit deletion download />
      }
      breadcrumbLinks={{
        Dashboard: '/',
        Bookings: BOOKINGS,
        [bookingId]: location.pathname,
      }}
    >
      {loading ? (
        <SkeletonLoader />
      ) : booking ? (
        <ViewBooking booking={booking} />
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
    resetBooking: () => dispatch(reset()),
    getBooking: bookingId =>
      dispatch({ type: GET_BOOKING, payload: bookingId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewBookingPage);
