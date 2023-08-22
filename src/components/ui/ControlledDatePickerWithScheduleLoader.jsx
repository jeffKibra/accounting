import { forwardRef } from 'react';
import { Spinner, Text, Box } from '@chakra-ui/react';
import PropTypes from 'prop-types';
//
import { useGetBookingsForMonth } from 'hooks';
//
//
import { getDateDetails } from 'utils/dates';
//
// import DateRangePicker from './DateRangePicker';
// import RHFDatePicker from 'components/ui/hookForm/RHFDatePicker';
import ControlledDatePicker from 'components/ui/ControlledDatePicker';
// import CustomDatePicker from './CustomDatePicker';

//----------------------------------------------------------------

const ControlledDatePickerWithScheduleLoader = forwardRef((props, ref) => {
  console.log({ props, ref });
  const { value, onChange, onBlur, name, isReadOnly, ...moreProps } = props;

  const activeDate = new Date(value || Date.now());
  const { yearMonth } = getDateDetails(activeDate);

  const { monthlyBookings, getMonthBookings } = useGetBookingsForMonth();

  const monthBookings = monthlyBookings[yearMonth];

  const loadingSchedule = !Boolean(monthBookings);

  console.log({ monthBookings, loadingSchedule });

  function handleCalendarOpen() {
    console.log('opening calendar...');

    if (!monthBookings) {
      console.log('fetching month schedule');
      getMonthBookings(yearMonth);
    }
  }

  return (
    <Box
      w="full"
      __css={{
        ...(loadingSchedule
          ? {
              '& div.react-datepicker__month': {
                display: 'none',
              },
            }
          : {}),
      }}
    >
      <ControlledDatePicker
        name={name}
        onBlur={onBlur}
        ref={ref}
        selected={value}
        onChange={onChange}
        isReadOnly={isReadOnly}
        onCalendarOpen={handleCalendarOpen}
        {...moreProps}
      >
        {loadingSchedule ? (
          <Box
            w="full"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Spinner my={2} />
            <Text mb={2}>Loading Month Schedule...</Text>
          </Box>
        ) : null}
      </ControlledDatePicker>{' '}
    </Box>
  );
});

ControlledDatePickerWithScheduleLoader.propTypes = {
  isReadOnly: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  name: PropTypes.string,
};

export default ControlledDatePickerWithScheduleLoader;
