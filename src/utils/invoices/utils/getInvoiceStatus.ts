import { checkIfIsSameDay } from '../../dates';
import { Invoice } from '../../../types';

function getDaysDifference(
  date: Date = new Date(),
  futureDate: Date = new Date()
) {
  if (checkIfIsSameDay(date, futureDate)) {
    // console.log('is same day');
    return 0;
  }

  const difference =
    (futureDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  // console.log({ difference });

  const days = Math.ceil(difference);
  // console.log({ days });

  return days;
}

export default function getInvoiceStatus(invoice: Invoice) {
  const { balance, total, dueDate, isSent, isOverdue } = invoice;
  const today = new Date();
  const isDue = dueDate.getTime() > today.getTime();
  const daysDue = getDaysDifference(today, dueDate);

  const dueToday = checkIfIsSameDay(today, dueDate);

  const partiallyPaid = balance < total;

  //   const overdue = today.getTime() > dueDate.getTime();
  // const overdueDays = getDaysDifference(dueDate, today);
  // console.log({ isOverdue, overdueDays, dueToday, daysDue, balance });

  let status = '';
  let message = '';

  if (balance === 0) {
    status = 'PAID';
  } else if (isOverdue) {
    status = 'OVERDUE';
  } else if (partiallyPaid && (dueToday || isDue)) {
    status = 'PARTIALLY PAID';
  } else if (dueToday) {
    status = 'DUE TODAY';
  } else if (isDue) {
    status = isSent ? 'SENT' : 'PENDING';
  } else {
    status = 'OVERDUE';
  }

  switch (status) {
    case 'PAID':
    case 'PARTIALLY PAID':
    case 'DUE TODAY':
      message = status;
      break;
    case 'SENT':
    case 'PENDING':
      if (daysDue === 1) {
        message = 'DUE TOMORROW';
      } else {
        message = `DUE IN ${daysDue} DAYS`;
      }
      break;
    case 'OVERDUE':
      message = status;
      // if (overdueDays === 0) {
      //   message = status;
      // } else {
      //   message = `OVERDUE BY ${overdueDays} DAYS`;
      // }
      break;
    default:
      message = status;
  }

  return { status, message };
}
