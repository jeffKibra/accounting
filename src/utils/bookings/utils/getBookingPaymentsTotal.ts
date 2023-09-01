import { IBookingPayments } from '../../../types';

export default function getBookingPaymentsTotal(payments: IBookingPayments) {
  return Object.keys(payments).reduce((sum: number, key) => {
    return sum + +payments[key];
  }, 0);
}
