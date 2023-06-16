import { useEffect, useState, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import { connect } from 'react-redux';

//
import { GET_MONTHLY_BOOKINGS } from 'store/actions/monthlyBookings';
//
import { Bookings } from 'utils/bookings';
import { getDaysDifference, confirmFutureDate } from 'utils/dates';

//
// import DateRangePicker from 'components/ui/DateRangePicker';
import SkeletonLoader from 'components/ui/SkeletonLoader';
import BookingDaysSelector from 'components/ui/BookingDaysSelector';

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
    // loading,
    loadingMonthlyBookings,
    monthlyBookings,
    fetchMonthlyBookings,
    defaultStartDate,
    defaultEndDate,
    defaultItemId,
  } = props;
  // console.log({ props });
  // console.log({ loadingMonthlyBookings, monthlyBookings });
  // const [dateRange, setDateRange] = useState(null);

  const [selectedDaysGroupedInMonths, setSelectedDaysGroupedInMonths] =
    useState({});
  const [availableItems, setAvailableItems] = useState({}); //converted into an object

  const {
    watch,
    // formState: { errors },
    setValue,
    getValues,
    setError,
    clearErrors,
  } = useFormContext();

  const defaultBookingDays = useMemo(() => {
    if (!defaultStartDate || !defaultEndDate) {
      return null;
    }

    const { ungroupedDates } = Bookings.getBookingDays(
      defaultStartDate,
      defaultEndDate
    );

    return ungroupedDates;
  }, [defaultStartDate, defaultEndDate]);
  // console.log({ defaultBookingDays });

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  // console.log({ startDate, endDate });

  useEffect(() => {
    try {
      if (startDate && endDate) {
        const endDateIsFutureDate = confirmFutureDate(startDate, endDate);
        if (endDateIsFutureDate) {
          clearErrors('endDate');
        } else {
          return setError('endDate', {
            type: 'validate',
            message: 'Return Date cannot be in the past!',
          });
        }

        //update quantity
        const quantity = getDaysDifference(startDate, endDate);
        // console.log({ quantity });
        setValue('quantity', quantity);
        //
        const { datesGroupedInMonths } = Bookings.getBookingDays(
          startDate,
          endDate
        );
        // console.log({ datesGroupedInMonths });

        //fetch current bookings from db and filter out items booking in selected dates
        const months = Object.keys(datesGroupedInMonths);
        // console.log({ months });

        // Bookings.getMonthlyBookings(orgId, months);
        fetchMonthlyBookings(months);

        setSelectedDaysGroupedInMonths(datesGroupedInMonths);
      }
    } catch (error) {
      console.error(error);
    }
  }, [
    startDate,
    endDate,
    fetchMonthlyBookings,
    setValue,
    setError,
    clearErrors,
  ]);

  useEffect(() => {
    try {
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
    } catch (error) {
      console.error(error);
    }
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

  // console.log({ availableItems });

  // console.log({ selectedDaysGroupedInMonths, availableItems });

  return (
    <>
      {/* <FormControl isDisabled={loading} isRequired isInvalid={errors.dateRange}>
        <FormLabel htmlFor="dateRange">Select Date Range</FormLabel>
        <DateRangePicker
          name="dateRange"
          isReadOnly={loading}
          inline
          // dateIntervalsToExclude={dateIntervalsToExclude}
        />
        <FormErrorMessage>{errors.dateRange?.message}</FormErrorMessage>
      </FormControl> */}
      <BookingDaysSelector />

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
