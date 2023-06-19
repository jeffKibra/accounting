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
//
// import DateRangePicker from './DateRangePicker';
import ControlledDatePicker from './ControlledDatePicker';
// import CustomDatePicker from './CustomDatePicker';

export default function BookingDaysSelector(props) {
  const { loading } = props;

  const {
    formState: { errors },
    control,
    watch,
  } = useFormContext();

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const days = watch('quantity');

  return (
    <Grid my={2} rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
      <GridItem colSpan={[12, 6]}>
        <FormControl
          isDisabled={loading}
          isRequired
          isInvalid={errors.startDate}
        >
          <FormLabel htmlFor="startDate">Pickup Date</FormLabel>
          <Controller
            name="startDate"
            control={control}
            rules={{
              required: { value: true, message: '*Required!' },
            }}
            render={({ field: { name, onBlur, onChange, value, ref } }) => {
              return (
                <ControlledDatePicker
                  name={name}
                  onBlur={onBlur}
                  ref={ref}
                  selected={value}
                  onChange={onChange}
                  isReadOnly={loading}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                />
              );
            }}
          />
          <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={[12, 6]}>
        <FormControl isDisabled={loading} isRequired isInvalid={errors.endDate}>
          <FormLabel htmlFor="endDate">Return Date</FormLabel>
          <Controller
            name="endDate"
            control={control}
            rules={{
              required: { value: true, message: '*Required!' },
            }}
            render={({ field: { name, onBlur, onChange, value, ref } }) => {
              return (
                <ControlledDatePicker
                  name={name}
                  onBlur={onBlur}
                  ref={ref}
                  selected={value}
                  onChange={onChange}
                  isReadOnly={loading}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                />
              );
            }}
          />
          <FormErrorMessage>{errors.endDate?.message}</FormErrorMessage>
          <FormHelperText>{`${days || ''} ${
            days ? 'days selected' : ''
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
  );
}
