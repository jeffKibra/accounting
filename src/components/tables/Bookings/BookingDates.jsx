import { Text } from '@chakra-ui/react';
//
import { datePropType } from 'propTypes';

function BookingDates(props) {
  const { startDate, endDate } = props;
  // console.log({ props });

  return (
    <>
      <Text color="blue" as="span">
        OUT: {new Date(startDate).toDateString()}
      </Text>
      <br />
      <Text as="span" color="green">
        IN: {new Date(endDate).toDateString()}
      </Text>
    </>
  );
}

BookingDates.propTypes = {
  startDate: datePropType,
  endDate: datePropType,
};

export default BookingDates;
