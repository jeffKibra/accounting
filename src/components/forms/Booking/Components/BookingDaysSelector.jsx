import { useEffect, useRef } from 'react';
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
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
//
//
// import DateRangePicker from './DateRangePicker';
import RHFDatePicker from 'components/ui/hookForm/RHFDatePicker';
import RHFDatePickerWithScheduleLoader from 'components/ui/hookForm/RHFDatePickerWithScheduleLoader';
// import CustomDatePicker from './CustomDatePicker';

import { DateDisplay } from './CustomDisplays';

//----------------------------------------------------------------

BookingDaysSelector.propTypes = {
  loading: PropTypes.bool,
  useInlineCalenders: PropTypes.bool,
  colSpan: PropTypes.number.isRequired,
  isEditing: PropTypes.bool,
};

BookingDaysSelector.defaultProps = {
  colSpan: 6,
};

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });
}

export default function BookingDaysSelector(props) {
  const { isEditing, loading, useInlineCalenders, colSpan } = props;

  const {
    formState: { errors },
    watch,
  } = useFormContext();

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const selectedDates = watch('selectedDates');
  const days = selectedDates?.length;

  useEffect(() => {
    const monthDiv = document.getElementById('div.react-datepicker__month');
    console.log({ monthDiv });
  }, []);

  const startDateRef = useRef(null);

  console.log({ startDateRef });

  function handleStartDateOpen(event) {
    console.log(event);
    const dateRef = startDateRef.current;
    if (dateRef) {
      const monthSelector = dateRef.querySelector('.react-datepicker__month');
      console.log({ monthSelector });

      if (monthSelector) {
        monthSelector.innerHTML = null;
      }
    }
  }

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

                <RHFDatePickerWithScheduleLoader
                  name="startDate"
                  required
                  isReadOnly={loading}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  inline={useInlineCalenders}
                  // onCalendarOpen={handleStartDateOpen}
                />
                {/* <RHFDatePicker
                    name="startDate"
                    required
                    isReadOnly={loading}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    inline={useInlineCalenders}
                    onCalendarOpen={handleStartDateOpen}
                    // renderDayContents={(day, date) => {
                    //   console.log({ day, date });
                    //   return day === 13 ? (
                    //     <Flex direction="column" alignItems="center">
                    //       <Spinner />
                    //       <Text>Loading Month Schedule...</Text>
                    //     </Flex>
                    //   ) : null;
                    // }}
                  /> */}
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

function LoadingSpinner() {
  return (
    <Flex direction="column" alignItems="center">
      <Spinner />
      <Text>Loading Month Schedule...</Text>
    </Flex>
  );
}
