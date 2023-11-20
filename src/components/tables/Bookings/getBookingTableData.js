import BookingOptions from 'containers/Management/Bookings/BookingOptions';

//
import BookingDates from './BookingDates';
import DueDateStatus from './DueDateStatus';
import BookingPaymentInput from './BookingPaymentInput';
//
import { getBookingBalance } from 'utils/bookings';

function convertInvoiceToBooking(invoice) {
  const { customer, customerNotes, subTotal, total, items } = invoice;
  const bookingData = items[0];
  //
  const {
    rate: bookingRate,
    total: bookingTotal,
    qty,
    details: { selectedDates, startDate, endDate, item: vehicle },
  } = bookingData;

  //
  const transferFee = items[1]?.total || 0;

  return {
    customer,
    customerNotes,
    vehicle,
    startDate,
    endDate,
    selectedDates,
    bookingRate,
    bookingTotal,
    transferFee,
    qty,
    subTotal,
    total,
  };
}

export default function getBookingTableData(
  bookingData,
  paymentTotal,
  paymentId,
  enableActions
) {
  // console.log({ item });
  // const { model: carModel, type } = item?.model || {};

  const booking = convertInvoiceToBooking(bookingData);

  delete booking?.__typename;
  delete booking?.vehicle?.__typename;
  delete booking?.vehicle?.model?.__typename;
  delete booking?.customer?.__typename;

  const {
    total,
    downPayment,
    paymentsReceived,
    startDate,
    endDate,
    selectedDates,
  } = booking;
  const imprest = downPayment?.amount || 0;

  let balance = booking?.balance || 0;
  let paymentAmount = 0;
  if (paymentId) {
    balance = getBookingBalance(booking, paymentId);
    paymentAmount = paymentsReceived[paymentId];
  }

  return {
    ...booking,
    total: Number(total).toLocaleString(),
    balance: Number(balance).toLocaleString(),
    imprest: Number(imprest).toLocaleString(),
    dueDate: <DueDateStatus booking={booking || {}} />,
    dates: <BookingDates startDate={startDate} endDate={endDate} />,
    // date: <bookingDates booking={booking} />,
    paymentAmount: Number(paymentAmount).toLocaleString(),
    days: selectedDates?.length || 0,
    paymentInput: (
      <BookingPaymentInput
        booking={booking}
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
