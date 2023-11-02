import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { BOOKINGS } from '../../../nav/routes';

import { CREATE_BOOKING } from '../../../store/actions/bookingsActions';
import { reset } from '../../../store/slices/bookingsSlice';

import useSavedLocation from '../../../hooks/useSavedLocation';

import PageLayout from '../../../components/layout/PageLayout';
// import NewBooking from 'containers/Management/Bookings/NewBooking';
import BookingForm from 'components/forms/Booking';

function NewBookingPage(props) {
  const { loading, action, isModified, createBooking, resetBooking } = props;
  useSavedLocation().setLocation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isModified) {
      resetBooking();
      navigate(BOOKINGS);
    }
  }, [isModified, resetBooking, navigate]);

  return (
    <PageLayout
      pageTitle="New Booking"
      breadcrumbLinks={{
        Dashboard: '/',
        Bookings: BOOKINGS,
        'New Booking': location.pathname,
      }}
    >
      <BookingForm
        updating={loading && action === CREATE_BOOKING}
        handleFormSubmit={createBooking}
      />
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified } = state.bookingsReducer;

  return { loading, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createBooking: payload => dispatch({ type: CREATE_BOOKING, payload }),
    resetBooking: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewBookingPage);
