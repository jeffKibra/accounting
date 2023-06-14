import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Box } from '@chakra-ui/react';

import { GET_BOOKINGS } from '../../../store/actions/bookingsActions';
import { reset } from '../../../store/slices/bookingsSlice';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import BookingsTable from '../../../components/tables/Bookings/BookingsTable';

function Bookings(props) {
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

  return loading && action === GET_BOOKINGS ? (
    <SkeletonLoader />
  ) : bookings?.length > 0 ? (
    <Box
      mt={-2}
      w="full"
      bg="white"
      borderRadius="md"
      shadow="md"
      py={4}
      px={2}
    >
      <BookingsTable
        bookings={bookings}
        showCustomer
        columnsToExclude={['paymentInput', 'paymentAmount', 'id']}
      />
    </Box>
  ) : (
    <Empty />
  );
}

function mapStateToProps(state) {
  const { loading, bookings, action, isModified } = state.bookingsReducer;

  return { loading, bookings, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    getBookings: () => dispatch({ type: GET_BOOKINGS }),
    resetBookings: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bookings);
