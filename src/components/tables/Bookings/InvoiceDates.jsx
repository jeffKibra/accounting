import PropTypes from 'prop-types';
import { Text } from '@chakra-ui/react';

import { checkIfIsSameDay } from '../../../utils/dates';

function InvoiceDates(props) {
  const { invoice } = props;
  // console.log({ props });
  const { saleDate, dueDate, balance } = invoice;
  const today = new Date();
  const overdueDays = Math.floor(
    (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isToday = checkIfIsSameDay(today, dueDate);
  const isOverdue = today.getTime() > dueDate.getTime();

  return (
    <>
      {saleDate.toDateString()} <br />{' '}
      <Text fontSize="xs" color="#1A202C">
        {balance > 0 && isToday ? (
          <>
            Due Date:{' '}
            <Text color="green" as="span">
              TODAY
            </Text>
          </>
        ) : isOverdue ? (
          <>
            OVERDUE:{' '}
            <Text as="span" color="red" fontSize="xs">
              {overdueDays} days
            </Text>
          </>
        ) : (
          <>Due Date: {dueDate.toDateString()}</>
        )}{' '}
      </Text>
    </>
  );
}

InvoiceDates.propTypes = {
  invoice: PropTypes.shape({
    invoiceDate: PropTypes.instanceOf(Date).isRequired,
    dueDate: PropTypes.instanceOf(Date).isRequired,
    balance: PropTypes.number.isRequired,
  }),
};

export default InvoiceDates;
