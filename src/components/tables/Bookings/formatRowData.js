import BookingOptions from 'containers/Management/Bookings/BookingOptions';

//
import BookingDates from './BookingDates';
import DueDateStatus from './DueDateStatus';
import InvoicePaymentInput from '../Invoices/InvoicePaymentInput';
//
import { Bookings } from 'utils/bookings';
// import { getInvoiceBalance } from 'utils/invoices';

export default function formatRowData(
  bookingData,
  paymentTotal,
  paymentId,
  enableActions
) {
  // console.log({ item });
  // const { model: carModel, type } = item?.model || {};

  const booking = Bookings.convertInvoiceToBooking(bookingData);
  // console.log({ booking });

  const {
    total,
    // downPayment,
    paymentsReceived,
    startDate,
    endDate,
    selectedDates,
    _id: bookingId,
  } = booking;
  // const imprest = downPayment?.amount || 0;

  let balance = booking?.balance || 0;
  let paymentAmount = 0;
  if (paymentId) {
    // balance = getBookingBalance(booking, paymentId);
    paymentAmount = paymentsReceived[paymentId];
  }

  return {
    ...booking,
    total: Number(total).toLocaleString(),
    balance: Number(balance).toLocaleString(),
    // imprest: Number(imprest).toLocaleString(),
    dueDate: <DueDateStatus booking={booking || {}} />,
    dates: <BookingDates startDate={startDate} endDate={endDate} />,
    // date: <bookingDates booking={booking} />,
    paymentAmount: Number(paymentAmount).toLocaleString(),
    days: selectedDates?.length || 0,
    paymentInput: (
      <InvoicePaymentInput
        invoiceId={bookingId}
        formIsDisabled={false}
        paymentTotal={paymentTotal}
        paymentId={paymentId}
        balance={balance}
      />
    ),

    ...(enableActions
      ? { actions: <BookingOptions booking={booking} edit view deletion /> }
      : {}),

    // status: (
    //   <Text
    //     fontSize="sm"
    //     color={
    //       status === 'OVERDUE'
    //         ? 'red'
    //         : status === 'PARTIALLY PAID' || status === 'PAID'
    //         ? 'green'
    //         : 'blue'
    //     }
    //   >
    //     {message}
    //   </Text>
    // ),
  };
}