import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { GET_CUSTOMER_BOOKINGS } from '../../../store/actions/bookingsActions';
import { reset } from '../../../store/slices/bookingsSlice';

import CustomSpinner from '../../../components/ui/CustomSpinner';
import Empty from '../../../components/ui/Empty';

import BookingsTable from '../../../components/tables/Bookings/BookingsTable';

function CustomerBookings(props) {
  const { loading, bookings, action, isModified, getBookings, resetBookings } =
    props;

  useEffect(() => {
    getBookings();
  }, [getBookings]);

  useEffect(() => {
    if (isModified) {
      resetBookings();
      getBookings();
    }
  }, [isModified, resetBookings, getBookings]);

  return loading && action === GET_CUSTOMER_BOOKINGS ? (
    <CustomSpinner />
  ) : bookings?.length > 0 ? (
    <BookingsTable
      columnsToExclude={['paymentAmount', 'paymentInput']}
      bookings={bookings}
    />
  ) : (
    <Empty />
  );
}

CustomerBookings.propTypes = {
  customerId: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  const { loading, bookings, action, isModified } = state.bookingsReducer;

  return { loading, bookings, action, isModified };
}

function mapDispatchToProps(dispatch, ownProps) {
  const { customerId } = ownProps;
  return {
    getBookings: () =>
      dispatch({ type: GET_CUSTOMER_BOOKINGS, payload: customerId }),
    resetBookings: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerBookings);
