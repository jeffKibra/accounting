import { useEffect, useMemo } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';

//
import { getDaysDifference, confirmFutureDate } from 'utils/dates';

//
// import DateRangePicker from './DateRangePicker';
import RHFDatePicker from 'components/ui/hookForm/RHFDatePicker';
// import CustomDatePicker from './CustomDatePicker';

export default function BookingDaysSelector(props) {
  const { loading } = props;

  const {
    formState: { errors },
    watch,
    clearErrors,
    setError,
    setValue,
    control,
  } = useFormContext();

  const startDate = watch('startDate');
  const endDate = watch('endDate');

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

  const days = useMemo(() => {
    //calculate days difference between start and end dates
    console.log('calculating number of days...');

    let daysDifference = 0;

    try {
      if (startDate && endDate) {
        //update quantity
        daysDifference = getDaysDifference(startDate, endDate);
      }
    } catch (error) {
      console.error(error);
    }

    return daysDifference;
  }, [startDate, endDate]);

  console.log({ days });

  return (
    <>
      <Controller
        name="quantity"
        control={control}
        render={() => {
          return <></>;
        }}
      />

      <Grid my={2} rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
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
    </>
  );
}
