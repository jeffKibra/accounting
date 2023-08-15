import { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import { Bookings } from 'utils/bookings';

//
import { confirmFutureDate } from 'utils/dates';

//
// import DateRangePicker from './DateRangePicker';
import RHFDatePicker from 'components/ui/hookForm/RHFDatePicker';
// import CustomDatePicker from './CustomDatePicker';

//----------------------------------------------------------------

BookingDaysSelector.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.func,
};

export default function BookingDaysSelector(props) {
  const { loading, children } = props;

  const {
    formState: { errors },
    watch,
    clearErrors,
    setError,
    setValue,
  } = useFormContext();

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const selectedDates = watch('selectedDates');

  useEffect(() => {
    //validate fields
    try {
      if (startDate && endDate) {
        const endDateIsFutureDate = confirmFutureDate(startDate, endDate);
        if (endDateIsFutureDate) {
          clearErrors('endDate');
        } else {
          return setError('endDate', {
            type: 'validate',
            message: 'Date of return cannot be in the past!',
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [startDate, endDate, setValue, setError, clearErrors]);

  // const days = useMemo(() => {
  //   //calculate days difference between start and end dates
  //   console.log('calculating number of days...');

  //   let daysDifference = 0;

  //   try {
  //     if (startDate && endDate) {
  //       //update quantity
  //       daysDifference = getDaysDifference(startDate, endDate);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }

  //   return daysDifference;
  // }, [startDate, endDate]);

  const [selectedDatesGroupedInMonths, setSelectedDatesGroupedInMonths] =
    useState({});

  useEffect(() => {
    //derives all selected dates from startDate and endDate
    if (startDate && endDate) {
      const bookingDays = Bookings.getBookingDays(startDate, endDate);
      console.log({ bookingDays });
      const { ungroupedDates, datesGroupedInMonths } = bookingDays;

      //update fields
      setValue('selectedDates', ungroupedDates);

      setSelectedDatesGroupedInMonths(datesGroupedInMonths);
    }
  }, [startDate, endDate, setValue]);

  const days = selectedDates?.length;

  return (
    <>
      <Grid
        my={2}
        rowGap={2}
        columnGap={4}
        templateColumns="repeat(12, 1fr)"
        w="full"
        mt={2}
        p={4}
        pb={4}
        bg="white"
        borderRadius="lg"
        shadow="lg"
        border="1px solid"
        borderColor="gray.200"
      >
        <GridItem colSpan={6}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors.startDate}
          >
            <FormLabel htmlFor="startDate">Pickup Date</FormLabel>

            <RHFDatePicker
              name="startDate"
              required
              isReadOnly={loading}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />

            <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={6}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors.endDate}
          >
            <FormLabel htmlFor="endDate">Return Date</FormLabel>
            <RHFDatePicker
              name="endDate"
              required
              isReadOnly={loading}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />

            <FormErrorMessage>{errors.endDate?.message}</FormErrorMessage>
            <FormHelperText>{`${days || ''} ${
              days ? `day${days > 1 ? 's' : ''} selected` : ''
            }`}</FormHelperText>
          </FormControl>
        </GridItem>

        {/* <GridItem colSpan={12}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors.dateRange}
          >
            <FormLabel htmlFor="dateRange">Selected Dates</FormLabel>
            <DateRangePicker
              name="dateRange"
              isReadOnly
              inline
              disabled
              // dateIntervalsToExclude={dateIntervalsToExclude}
            />
            <FormErrorMessage>{errors.dateRange?.message}</FormErrorMessage>
          </FormControl>
        </GridItem> */}
      </Grid>

      {typeof children === 'function' && children(selectedDatesGroupedInMonths)}
    </>
  );
}
