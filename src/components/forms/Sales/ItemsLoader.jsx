import { useEffect, useState, useMemo } from 'react';
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
    defaultDateRange,
    defaultItemId,
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
    getValues,
  } = useFormContext();

  const defaultBookingDays = useMemo(() => {
    if (!defaultDateRange) {
      return null;
    }

    const { ungroupedDates } = Bookings.getBookingDays(defaultDateRange);

    return ungroupedDates;
  }, [defaultDateRange]);
  console.log({ defaultBookingDays });

  const dateRange = watch('dateRange');
  console.log({ dateRange });

  useEffect(() => {
    console.log('date range has changed', dateRange);
    if (Array.isArray(dateRange)) {
      const start = dateRange[0];
      const end = dateRange[1];
      console.log({ start, end });

      if (start && end) {
        //update quantity
        const quantity = getDaysDifference(start, end);
        console.log({ quantity });
        setValue('quantity', quantity);
        //
        const { datesGroupedInMonths } = Bookings.getBookingDays(dateRange);
        console.log({ datesGroupedInMonths });

        //fetch current bookings from db and filter out items booking in selected dates
        const months = Object.keys(datesGroupedInMonths);
        console.log({ months });

        // Bookings.getMonthlyBookings(orgId, months);
        fetchMonthlyBookings(months);

        setSelectedDaysGroupedInMonths(datesGroupedInMonths);
      }
    }
  }, [dateRange, fetchMonthlyBookings, setValue]);

  useEffect(() => {
    const itemsNotBooked = Bookings.getItemsNotBooked(
      monthlyBookings,
      selectedDaysGroupedInMonths,
      items,
      defaultItemId,
      defaultBookingDays
    );

    const currentSelectedItem = getValues('item');
    const currentSelectedItemId = currentSelectedItem?.itemId;

    const currentSelectedItemIsAvailable = Boolean(
      itemsNotBooked[currentSelectedItemId]
    );
    // console.log({ currentSelectedItemIsAvailable });

    if (!currentSelectedItemIsAvailable) {
      setValue('item', null);
      setValue('bookingRate', 0);
    }

    setAvailableItems(itemsNotBooked);
  }, [
    setAvailableItems,
    monthlyBookings,
    items,
    selectedDaysGroupedInMonths,
    defaultItemId,
    defaultBookingDays,
    getValues,
    setValue,
  ]);

  // console.log({ selectedDaysGroupedInMonths, availableItems });

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
