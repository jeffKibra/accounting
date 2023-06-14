import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import { Text } from '@chakra-ui/react';

import BookingDates from 'components/tables/Bookings/BookingDates';
import CustomRawTable from 'components/tables/CustomRawTable';
import ControlledNumInput from 'components/ui/ControlledNumInput';

import { getBookingBalance } from 'utils/bookings';

// import { RiEdit2Line } from "react-icons/ri";
// import CustomModal from "../../ui/CustomModal";
// import EditbookingPaymentForm from "../../forms/PaymentsReceived/EditbookingPaymentForm";

function UnpaidBookingsTable(props) {
  const {
    bookings,
    paymentId,
    amount,
    // loading,
    formIsDisabled,
    // taxDeducted,
  } = props;
  // console.log({ props });
  const { control } = useFormContext();

  const columns = useMemo(() => {
    return [
      // { Header: "", accessor: "actions" },
      { Header: 'Car', accessor: 'car' },
      { Header: 'Booking Dates', accessor: 'date' },
      { Header: 'Days', accessor: 'quantity', isNumeric: true },
      { Header: 'Booking#', accessor: 'bookingId' },
      { Header: 'Total', accessor: 'total', isNumeric: true },
      { Header: 'Amount Due', accessor: 'balance', isNumeric: true },
      // ...(taxDeducted === "yes"
      //   ? [{ Header: "Withholding Tax", accessor: "withholdingTax" }]
      //   : []),
      {
        Header: 'Payment',
        accessor: 'payment',
        width: '16%',
        isNumeric: true,
      },
    ];
  }, []);

  const data = useMemo(() => {
    return bookings.map(booking => {
      const { id, transactionType, total, item } = booking;
      const balance = getBookingBalance(booking, paymentId);
      const max = Math.min(amount, balance);
      // console.log({
      //   paymentId,
      //   max,
      //   amount,
      //   balance,
      //   pp: booking.payments,
      // });

      return {
        ...booking,
        bookingId: transactionType === 'booking' ? id : transactionType,
        balance: Number(balance).toLocaleString(),
        total: Number(total).toLocaleString(),
        date: <BookingDates dateRange={booking?.dateRange || []} />,
        car: <Text textTransform="uppercase">{item?.name || ''}</Text>,
        payment: (
          <Controller
            name={`payments.${id}`}
            control={control}
            render={({ field: { ref, onChange, onBlur, value } }) => {
              return (
                <ControlledNumInput
                  ref={ref}
                  mode="onBlur"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  min={0}
                  max={max}
                  isDisabled={formIsDisabled}
                />
              );
            }}
          />
        ),
      };
    });
  }, [bookings, paymentId, amount, formIsDisabled, control]);

  return (
    <CustomRawTable
      data={data}
      columns={columns}
      caption="The Excess amount is added to the customers account!"
    />
  );
}

UnpaidBookingsTable.propTypes = {
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      customer: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        companyName: PropTypes.string,
      }),
      total: PropTypes.number,
      saleDate: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.string,
      ]).isRequired,
      dueDate: PropTypes.oneOfType([
        PropTypes.instanceOf(Date),
        PropTypes.string,
      ]).isRequired,
      status: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
    })
  ),
  paymentId: PropTypes.string,
  amount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  // taxDeducted: PropTypes.oneOf(["yes", "no"]),
};

export default UnpaidBookingsTable;

// actions: (
//   <CustomModal
//     title={`Payment ${bookingSlug}`}
//     closeOnOverlayClick={false}
//     renderTrigger={(onOpen) => {
//       return (
//         <IconButton
//           size="xs"
//           colorScheme="cyan"
//           onClick={onOpen}
//           icon={<RiEdit2Line />}
//           title="edit balance"
//         />
//       );
//     }}
//     renderContent={(onClose) => {
//       return (
//         <EditbookingPaymentForm
//           onClose={onClose}
//           handleFormSubmit={editPayment}
//           booking={booking}
//           summary={summary}
//           paymentId={paymentId}
//           taxDeducted={taxDeducted}
//         />
//       );
//     }}
//   />
// ),
