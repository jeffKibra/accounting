import { forwardRef, useState, useEffect, useMemo } from 'react';
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
import ControlledDefaultDatePicker from 'components/ui/ControlledDefaultDatePicker';
// import CustomDatePicker from './CustomDatePicker';

//----------------------------------------------------------------

const ControlledDatePickerWithScheduleLoader = forwardRef((props, ref) => {
  // console.log({ props, ref });
  const {
    value,
    onChange,
    onBlur,
    name,
    isReadOnly,
    itemId,
    preselectedDates,
    ...moreProps
  } = props;

  const preselectedDatesObject = useMemo(() => {
    const map = {};
    if (Array.isArray(preselectedDates)) {
      preselectedDates.forEach(dateString => {
        map[dateString] = dateString;
      });
    }

    return map;
  }, [preselectedDates]);

  const activeDate = new Date(value || Date.now());

  const { monthlyBookings, getMonthBookings } = useGetBookingsForMonth();

  const [activeMonth, setActiveMonth] = useState('');

  useEffect(() => {
    //fetch schedule for month if not downloaded already
    if (activeMonth) {
      // const currentMonthBookings = monthlyBookings[activeMonth];
      // console.log({ currentMonthBookings });
      // console.log('fetching month schedule...', {
      //   activeMonth,
      //   currentMonthBookings,
      // });

      // const items = currentMonthBookings
      //   ? Object.keys(currentMonthBookings)
      //   : [];
      // const hasError = currentMonthBookings?.error;

      getMonthBookings(activeMonth);
    }

    //eslint-disable-next-line
  }, [activeMonth, getMonthBookings]);

  function updateActiveMonth(incomingDate) {
    const dateToUse = new Date(incomingDate || Date.now());
    const { yearMonth } = getDateDetails(dateToUse);

    setActiveMonth(yearMonth);
  }

  function handleCalendarOpen() {
    //update active month
    console.log('opening calendar...');

    updateActiveMonth(activeDate);
  }

  function handleCalendarClose() {
    //reset active month
    console.log('closing calendar...');

    setActiveMonth('');
  }

  //
  const monthBookings = monthlyBookings[activeMonth];

  const loadingSchedule = !Boolean(monthBookings);

  // console.log({ activeMonth, monthBookings, loadingSchedule });

  const itemBookingsForMonth = useMemo(() => {
    return monthBookings ? monthBookings[itemId] || [] : [];
  }, [monthBookings, itemId]);

  // console.log({ itemBookingsForMonth, monthBookings, itemId });

  const alreadyBookedDates = useMemo(() => {
    const alreadyBooked = [];

    itemBookingsForMonth.forEach(dateString => {
      const dateToExclude = preselectedDatesObject[dateString];

      const isAlreadyBooked = !Boolean(dateToExclude);
      // console.log({ dateToExclude, isAlreadyBooked });

      if (isAlreadyBooked) {
        alreadyBooked.push(new Date(dateString));
      }
    });
  }, [itemBookingsForMonth, preselectedDatesObject]);

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
        '& div.react-datepicker__day--highlighted': {
          borderBottom: '2px solid red',
          backgroundColor: 'transparent',
        },
      }}
    >
      <ControlledDefaultDatePicker
        name={name}
        onBlur={onBlur}
        ref={ref}
        selected={value}
        onChange={onChange}
        isReadOnly={isReadOnly}
        onCalendarOpen={handleCalendarOpen}
        onCalendarClose={handleCalendarClose}
        onMonthChange={updateActiveMonth}
        highlightDates={alreadyBookedDates}
        excludeDates={alreadyBookedDates}
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
        ) : (
          <Text pl={4} py={2}>
            <Text color="red">Red Highlight = </Text>
            Already Booked Dates
          </Text>
        )}
      </ControlledDefaultDatePicker>{' '}
    </Box>
  );
});

ControlledDatePickerWithScheduleLoader.propTypes = {
  isReadOnly: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  name: PropTypes.string,
  itemId: PropTypes.string.isRequired,
  preselectedDates: PropTypes.array,
};

export default ControlledDatePickerWithScheduleLoader;
