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

//
// import DateRangePicker from './DateRangePicker';
import RHFDatePicker from 'components/ui/hookForm/RHFDatePicker';
// import CustomDatePicker from './CustomDatePicker';

//----------------------------------------------------------------

BookingDaysSelector.propTypes = {
  loading: PropTypes.bool,
  useInlineCalenders: PropTypes.bool,
};

export default function BookingDaysSelector(props) {
  const { loading, useInlineCalenders } = props;

  const {
    formState: { errors },
    watch,
  } = useFormContext();

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const selectedDates = watch('selectedDates');

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

  const days = selectedDates?.length;

  const colSpan = useInlineCalenders ? 12 : 6;

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
          >
            <FormLabel htmlFor="startDate">Pickup Date</FormLabel>
            {useInlineCalenders ? (
              <FormHelperText>
                Click on a date to set it as the Pick up Date
              </FormHelperText>
            ) : null}

            <RHFDatePicker
              name="startDate"
              required
              isReadOnly={loading}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              inline={useInlineCalenders}
            />

            <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={colSpan}>
          <FormControl
            isDisabled={loading}
            isRequired
            isInvalid={errors.endDate}
          >
            <FormLabel htmlFor="endDate">Return Date</FormLabel>

            {useInlineCalenders ? (
              <FormHelperText>
                Click on a date to set it as the Return Date
              </FormHelperText>
            ) : null}

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
