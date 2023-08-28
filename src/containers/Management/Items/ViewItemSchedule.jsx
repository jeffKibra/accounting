import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
//

//

export default function ViewItemSchedule(props) {
  // console.log({ props });
  const { item } = props;
  const { name, model: modelData, year } = item;
  const { model, make } = modelData;

  //   let startDate = new Date();
  //   let endDate = new Date();
  //   if (Array.isArray(dateRange)) {
  //     const incomingStartDate = dateRange[0];
  //     const incomingEndDate = dateRange[1] || incomingStartDate;

  //     const startDateIsValid = checkIfDateIsValid(incomingStartDate);
  //     const endDateIsValid = checkIfDateIsValid(incomingEndDate);
  //     console.log({ startDateIsValid, endDateIsValid });

  //     if (startDateIsValid && endDateIsValid) {
  //       startDate = new Date(incomingStartDate);
  //       endDate = new Date(incomingEndDate);
  //     }
  //   }

  function handleMonthChange(date) {
    console.log({ date });
  }

  return (
    <Box w="100%" shadow="lg" p={4} borderRadius="lg">
      <VStack w="full" alignItems="flex-start">
        <Heading>{String(name).toUpperCase()}</Heading>
        <Text>{`${make} ${model} (${year})`}</Text>
      </VStack>

      <Box
        py={4}
        __css={{
          '& > div': {
            display: 'flex',
            justifyContent: 'center',
          },
        }}
      >
        <DatePicker
          // onBlur={onBlur}
          // ref={ref}
          // selected={value}
          // onChange={onChange}
          // customInput={<DateInput name={name} />}
          // selected={new Date()}
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          dateFormat="dd-MMM-yyyy"
          showIcon
          inline
          onMonthChange={handleMonthChange}
          disabled

          // {...extraProps}
        />{' '}
      </Box>

      {/* {Object.keys(bookings).length > 0 ? (
        <VehicleBookings bookings={bookings} />
      ) : null} */}
    </Box>
  );
}
