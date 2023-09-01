import PropTypes from 'prop-types';
import { Text } from '@chakra-ui/react';

import { checkIfIsSameDay } from '../../../utils/dates';
// import { getInvoiceStatus } from '../../../utils/invoices';

function DueDateStatus(props) {
  const { invoice } = props;
  // console.log({ props });
  const { dueDate, balance } = invoice;
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
  invoice: PropTypes.shape({
    invoiceDate: PropTypes.instanceOf(Date).isRequired,
    dueDate: PropTypes.instanceOf(Date).isRequired,
    balance: PropTypes.number.isRequired,
  }),
};

export default DueDateStatus;
