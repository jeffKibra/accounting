import { useState, useEffect, useMemo } from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
//
import { getDateDetails } from 'utils/dates';
import { useGetBookingsForMonth } from 'hooks';
//
import ControlledBookingDatePicker from 'components/ui/ControlledBookingDatePicker';
//

export default function ViewItemSchedule(props) {
  // console.log({ props });
  const { item } = props;
  const { name, model: modelData, year, itemId } = item;
  const { model, make } = modelData;

  const [activeMonth, setActiveMonth] = useState(null);

  //set active month onmount
  useEffect(() => {
    const { yearMonth } = getDateDetails(new Date());
    setActiveMonth(yearMonth);
  }, [setActiveMonth]);

  const { getMonthBookings, monthlyBookings } = useGetBookingsForMonth();

  const monthBookings = monthlyBookings ? monthlyBookings[activeMonth] : null;

  const itemBookingsForMonth = useMemo(() => {
    let itemBookings = monthBookings ? monthBookings[itemId] || [] : [];

    if (Array.isArray(itemBookings)) {
      itemBookings = itemBookings.map(dateString => new Date(dateString));
    }

    return itemBookings;
  }, [monthBookings, itemId]);

  const loadingMonthlyBookings = !Boolean(monthBookings);

  useEffect(() => {
    if (activeMonth) {
      getMonthBookings(activeMonth);
    }
  }, [activeMonth, getMonthBookings]);

  function handleMonthChange(date) {
    // console.log({ date });
    const { yearMonth } = getDateDetails(new Date(date));

    //update active month
    setActiveMonth(yearMonth);
  }

  // console.log({
  //   activeMonth,
  //   monthlyBookings,
  //   monthBookings,
  //   itemBookingsForMonth,
  //   loadingMonthlyBookings,
  // });

  function disableAllDates(date) {
    return false;
  }

  function renderDayContents(day, date) {
    const { yearMonth } = getDateDetails(new Date(date));
    return yearMonth === activeMonth ? day : '';
  }

  return (
    <Box w="100%" shadow="lg" p={4} borderRadius="lg">
      <VStack w="full" alignItems="flex-start">
        <Heading>{String(name).toUpperCase()}</Heading>
        <Text>{`${make} ${model} (${year})`}</Text>
      </VStack>

      <Box py={4}>
        <ControlledBookingDatePicker
          name=""
          onChange={() => {}}
          value={null}
          ref={null}
          loading={loadingMonthlyBookings}
          // loading
          inline
          disabled
          onMonthChange={handleMonthChange}
          highlightDates={itemBookingsForMonth}
          bookedDates={itemBookingsForMonth}
          filterDate={disableAllDates}
          renderDayContents={renderDayContents}
          error={monthBookings?.error || null}
          wrapperCSS={{
            '& > div': {
              display: 'flex',
              justifyContent: 'center',
            },
            '& div.react-datepicker': {
              display: 'flex',
              flexDirection: 'column',
            },
          }}
          // {...extraProps}
        />
      </Box>
    </Box>
  );
}
