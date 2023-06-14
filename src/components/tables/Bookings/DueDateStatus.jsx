import PropTypes from 'prop-types';
import { Text } from '@chakra-ui/react';

import { checkIfIsSameDay } from '../../../utils/dates';
// import { getbookingStatus } from '../../../utils/bookings';

function DueDateStatus(props) {
  const { booking } = props;
  // console.log({ props });
  const { balance } = booking;
  const dueDate = new Date(booking?.dueDate || Date.now());
  const today = new Date();
  const overdueDays = Math.floor(
    (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isToday = checkIfIsSameDay(today, dueDate);
  const isOverdue = today.getTime() > dueDate.getTime();

  return (
    <Text
      color={balance > 0 && isToday ? 'green' : isOverdue ? 'red' : '#1A202C'}
    >
      {balance > 0 && isToday
        ? 'TODAY'
        : isOverdue
        ? `${overdueDays} days ago`
        : new Date(dueDate).toDateString()}{' '}
    </Text>
  );
}

DueDateStatus.propTypes = {
  booking: PropTypes.shape({
    saleDate: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.string,
    ]).isRequired,
    dueDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
      .isRequired,
    balance: PropTypes.number.isRequired,
  }),
};

export default DueDateStatus;
