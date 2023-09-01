import PropTypes from 'prop-types';
import { Text } from '@chakra-ui/react';

function BookingDates(props) {
  const { dateRange } = props;
  // console.log({ props });
  let startDate = '';
  let endDate = '';

  if (Array.isArray(dateRange)) {
    const start = dateRange[0];
    const end = dateRange[1] || start;

    startDate = new Date(start).toDateString();
    endDate = new Date(end).toDateString();
  }

  return (
    <>
      <Text color="blue" as="span">
        OUT: {startDate}
      </Text>
      <br />
      <Text as="span" color="green">
        IN: {endDate}
      </Text>
    </>
  );
}

BookingDates.propTypes = {
  dateRange: PropTypes.array.isRequired,
};

export default BookingDates;
