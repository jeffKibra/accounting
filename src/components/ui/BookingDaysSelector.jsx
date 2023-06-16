import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
//
//
// import DateRangePicker from './DateRangePicker';
// import ControlledDatePicker from './ControlledDatePicker';
import CustomDatePicker from './CustomDatePicker';

export default function BookingDaysSelector(props) {
  const { loading } = props;

  const {
    formState: { errors },
  } = useFormContext();

  return (
    <Grid my={2} rowGap={2} columnGap={4} templateColumns="repeat(12, 1fr)">
      <GridItem colSpan={[12, 6]}>
        <FormControl
          isDisabled={loading}
          isRequired
          isInvalid={errors.startDate}
        >
          <FormLabel htmlFor="startDate">Pickup Date</FormLabel>
          <CustomDatePicker isReadOnly={loading} name="startDate" />
          <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={[12, 6]}>
        <FormControl isDisabled={loading} isRequired isInvalid={errors.endDate}>
          <FormLabel htmlFor="endDate">Return Date</FormLabel>
          <CustomDatePicker isReadOnly={loading} name="endDate" />
          <FormErrorMessage>{errors.endDate?.message}</FormErrorMessage>
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
