import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Box } from '@chakra-ui/react';

import { GET_BOOKINGS } from '../../../store/actions/bookingsActions';
import { reset } from '../../../store/slices/bookingsSlice';

//
// import { useSearchBookings } from 'hooks';

import BookingsTable from '../../../components/tables/Bookings/BookingsTable';

function Bookings(props) {
  const { isModified, getBookings, resetBookings } = props;

  // const { bookings, loading } = useSearchBookings();

  useEffect(() => {
    if (isModified) {
      resetBookings();
      getBookings();
    }
  }, [isModified, resetBookings, getBookings]);

  return (
    <Box
      mt={-2}
      w="full"
      bg="white"
      borderRadius="md"
      shadow="md"
      py={4}
      // px={2}
    >
      <BookingsTable
        showCustomer
        columnsToExclude={['paymentInput', 'paymentAmount', 'id']}
      />
    </Box>
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
