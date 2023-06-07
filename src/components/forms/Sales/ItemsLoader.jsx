import { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import { connect } from 'react-redux';

//
import { GET_MONTHLY_BOOKINGS } from 'store/actions/monthlyBookings';
//
import { Bookings } from 'utils/bookings';
import { getDaysDifference } from 'utils/dates';
//
import DateRangePicker from 'components/ui/DateRangePicker';
import SkeletonLoader from 'components/ui/SkeletonLoader';

//---------------------------------------------------------------
ItemsLoader.propTypes = {
  loading: PropTypes.bool.isRequired,
  childrem: PropTypes.node.isRequired,
  items: PropTypes.array.isRequired,
};

//------------------------------------------------------------------------------

function ItemsLoader(props) {
  const {
    children,
    items,
    loading,
    loadingMonthlyBookings,
    monthlyBookings,
    fetchMonthlyBookings,
  } = props;
  console.log({ props });
  console.log({ loadingMonthlyBookings, monthlyBookings });
  // const [dateRange, setDateRange] = useState(null);

  const [selectedDaysGroupedInMonths, setSelectedDaysGroupedInMonths] =
    useState({});
  const [availableItems, setAvailableItems] = useState({}); //converted into an object

  const {
    watch,
    formState: { errors },
    setValue,
  } = useFormContext();

  const dateRange = watch('dateRange');
  console.log({ dateRange });

  useEffect(() => {
    console.log('date range has changed', dateRange);
    if (Array.isArray(dateRange)) {
      const start = dateRange[0];
      const end = dateRange[1];
      console.log({ start, end });

      if (start && end) {
        const daysGroupedInMonths = Bookings.getBookingDays(dateRange);
        console.log({ daysGroupedInMonths });

        //fetch current bookings from db and filter out items booking in selected dates
        const months = Object.keys(daysGroupedInMonths);
        console.log({ months });

        // Bookings.getMonthlyBookings(orgId, months);
        fetchMonthlyBookings(months);

        setSelectedDaysGroupedInMonths(daysGroupedInMonths);
      }
    }
  }, [dateRange, fetchMonthlyBookings]);

  useEffect(() => {
    const itemsNotBooked = Bookings.getItemsNotBooked(
      monthlyBookings,
      selectedDaysGroupedInMonths,
      items
    );
    setAvailableItems(itemsNotBooked);
  }, [setAvailableItems, monthlyBookings, items, selectedDaysGroupedInMonths]);

  console.log({ selectedDaysGroupedInMonths, availableItems });

  useEffect(() => {
    if (Array.isArray(dateRange)) {
      const [startDate, endDate] = dateRange;

      if (startDate && endDate) {
        const quantity = getDaysDifference(startDate, endDate);
        console.log({ quantity });

        setValue('quantity', quantity);
      }
    }
  }, [dateRange, setValue]);

  return (
    <>
      <FormControl isDisabled={loading} isRequired isInvalid={errors.dateRange}>
        <FormLabel htmlFor="dateRange">Select Date Range</FormLabel>
        <DateRangePicker
          name="dateRange"
          isReadOnly={loading}
          // inline
          // dateIntervalsToExclude={dateIntervalsToExclude}
        />
        <FormErrorMessage>{errors.dateRange?.message}</FormErrorMessage>
      </FormControl>

      {loadingMonthlyBookings ? <SkeletonLoader /> : null}

      <Box display={loadingMonthlyBookings ? 'none' : 'block'}>
        {children(availableItems)}
      </Box>
    </>
  );
}

function mapStateToProps(state) {
  const { loading, monthlyBookings } = state?.monthlyBookingsReducer;

  return { loadingMonthlyBookings: loading, monthlyBookings };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchMonthlyBookings: months =>
      dispatch({ type: GET_MONTHLY_BOOKINGS, payload: months }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsLoader);
