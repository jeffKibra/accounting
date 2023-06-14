import { IBooking } from '../../../types';

export default function getBookingBalance(
  booking: IBooking,
  paymentId: string
) {
  const { paymentsReceived, balance } = booking;
  const payment = paymentsReceived[paymentId] || 0;

  return balance + payment;
}
