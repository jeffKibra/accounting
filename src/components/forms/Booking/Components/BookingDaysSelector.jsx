import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Grid,
  GridItem,
  Flex,
  Spinner,
  Text,
  Box,
  Input,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import { getDateDetails } from 'utils/dates';
//
// import DateRangePicker from './DateRangePicker';
import RHFDatePicker from 'components/ui/hookForm/RHFDatePicker';
// import CustomDatePicker from './CustomDatePicker';

import { DateDisplay } from './CustomDisplays';

//----------------------------------------------------------------

BookingDaysSelector.propTypes = {
  loading: PropTypes.bool,
  useInlineCalenders: PropTypes.bool,
  colSpan: PropTypes.number.isRequired,
  isEditing: PropTypes.bool,
  loadSchedules: PropTypes.bool,
  itemId: PropTypes.string,
};

BookingDaysSelector.defaultProps = {
  colSpan: 6,
};

export default function BookingDaysSelector(props) {
  const {
    isEditing,
    loading,
    useInlineCalenders,
    colSpan,
    itemId,
    loadSchedules,
  } = props;

  const monthlyBookings = useSelector(
    state => state?.monthlyBookingsReducer?.monthlyBookings
  );

  const {
    formState: { errors },
    watch,
    setError,
    clearErrors,
    control,
  } = useFormContext();

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const selectedDates = watch('selectedDates');
  console.log({ selectedDates });
  const days = selectedDates?.length;

  useEffect(() => {
    if (Array.isArray(selectedDates) && monthlyBookings) {
      const itemMonthlyBookings = {};

      const alreadyBookedDate = selectedDates.find(selectedDate => {
        const { yearMonth, yearMonthDay } = getDateDetails(
          new Date(selectedDate)
        );

        let itemBookingsForMonth = itemMonthlyBookings[yearMonth];

        if (!itemBookingsForMonth) {
          const monthBookings = monthlyBookings[yearMonth];
          const itemBookingsForMonthArray = monthBookings
            ? monthBookings[itemId] || []
            : [];

          itemBookingsForMonth = itemBookingsForMonthArray.reduce(
            (acc, date) => {
              return {
                ...acc,
                [date]: date,
              };
            },
            {}
          );

          itemMonthlyBookings[yearMonth] = itemBookingsForMonth;
        }
        console.log({ itemBookingsForMonth });

        const dateIsAlreadyBooked = Boolean(itemBookingsForMonth[yearMonthDay]);
        console.log({ dateIsAlreadyBooked, yearMonthDay });

        return dateIsAlreadyBooked;
      });

      console.log({ alreadyBookedDate });

      if (alreadyBookedDate) {
        //update form Errors
        setError('endDate', {
          type: 'validate',
          message: 'Some of the selected dates have already been booked!',
        });
      } else {
        //clear any date range errors
        clearErrors('endDate');
      }
    }
  }, [selectedDates, monthlyBookings, itemId, setError, clearErrors]);

  const startDateRef = useRef(null);

  console.log({ startDateRef });

  return (
    <>
      <Grid
        my={2}
        rowGap={2}
        columnGap={4}
        templateColumns="repeat(12, 1fr)"
        w="full"
      >
        <GridItem colSpan={colSpan}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors.startDate}
            ref={startDateRef}
          >
            {useInlineCalenders ? (
              <FormHelperText>
                Click on a date to set it as the Pick up Date
              </FormHelperText>
            ) : null}

            {isEditing ? (
              <>
                <FormLabel fontSize="14px" htmlFor="startDate">
                  Pickup Date
                </FormLabel>

                {/* <RHFDatePickerWithScheduleLoader
                  name="startDate"
                  required
                  isReadOnly={loading}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  inline={useInlineCalenders}
                /> */}
                <RHFDatePicker
                  name="startDate"
                  required
                  isReadOnly={loading}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  inline={useInlineCalenders}
                  itemId={itemId}
                  loadSchedules={loadSchedules}
                  // renderDayContents={(day, date) => {
                  //   console.log({ day, date });
                  //   return day === 13 ? (
                  //     <Flex direction="column" alignItems="center">
                  //       <Spinner />
                  //       <Text>Loading Month Schedule...</Text>
                  //     </Flex>
                  //   ) : null;
                  // }}
                />
              </>
            ) : (
              <DateDisplay title="Pickup Date" value={startDate} />
            )}

            <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={colSpan}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors.endDate}
          >
            {useInlineCalenders ? (
              <FormHelperText>
                Click on a date to set it as the Return Date
              </FormHelperText>
            ) : null}

            {isEditing ? (
              <>
                <FormLabel fontSize="14px" htmlFor="endDate">
                  Return Date
                </FormLabel>
                <RHFDatePicker
                  name="endDate"
                  required
                  isReadOnly={loading}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  inline={useInlineCalenders}
                  itemId={itemId}
                  loadSchedules={loadSchedules}
                />
              </>
            ) : (
              <DateDisplay title="Return Date" value={endDate} />
            )}

            <FormErrorMessage>{errors.endDate?.message}</FormErrorMessage>
            <FormHelperText>{`${days || ''} ${
              days ? `day${days > 1 ? 's' : ''} selected` : ''
            }`}</FormHelperText>
          </FormControl>
        </GridItem>

        <GridItem colSpan={12}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors?.selectedDates}
          >
            <Controller
              name="selectedDates"
              control={control}
              rules={{
                validate: val => {
                  console.log({ val });

                  return false;
                },
              }}
              render={({ field: { name, onBlur, onChange, ref, value } }) => {
                console.log({ value });

                function handleChange(e) {
                  const inValue = e?.target?.value;
                  console.log({ inValue });

                  onChange(e);
                }

                return (
                  <>
                    <Input onChange={handleChange} value={value} />
                    {JSON.stringify(value)}
                    <FormErrorMessage>
                      {errors?.selectedDates?.message}
                    </FormErrorMessage>
                  </>
                );
              }}
            />
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
    </>
  );
}
