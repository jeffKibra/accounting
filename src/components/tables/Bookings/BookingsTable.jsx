import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Text } from '@chakra-ui/react';

// import useDeletebooking from "../../../hooks/useDeletebooking";
import BookingOptions from '../../../containers/Management/Bookings/BookingOptions';

import CustomRawTable from '../CustomRawTable';
// import TableActions from "../TableActions";

// import bookingDates from './bookingDates';
import BookingDates from './BookingDates';
import DueDateStatus from './DueDateStatus';
import BookingPaymentInput from './BookingPaymentInput';
//
import { getBookingBalance } from 'utils/bookings';
//
import { bookingProps } from 'propTypes';

function BookingsTable(props) {
  const { bookings, showCustomer, paymentTotal, paymentId, columnsToExclude } =
    props;
  // console.log({ bookings });

  const columns = useMemo(() => {
    const allColumns = [
      { Header: 'Car', accessor: 'car' },
      { Header: 'Booking Dates', accessor: 'date' },

      { Header: 'Days', accessor: 'quantity', isNumeric: true },
      { Header: 'Booking#', accessor: 'id' },
      ...(showCustomer
        ? [{ Header: 'Customer', accessor: 'customer.displayName' }]
        : []),
      // { Header: 'Status', accessor: 'status' },

      // { Header: 'Payments Due', accessor: 'dueDate' },
      { Header: 'Total', accessor: 'total', isNumeric: true },
      { Header: 'Imprest', accessor: 'imprest', isNumeric: true },
      { Header: 'Balance', accessor: 'balance', isNumeric: true },
      { Header: 'Payment', accessor: 'paymentAmount', isNumeric: true },
      { Header: 'Pay', accessor: 'paymentInput', isNumeric: true },
      { Header: '', accessor: 'actions', isNumeric: true },
    ];

    const columnsToExcludeMap = {};
    if (Array.isArray(columnsToExclude)) {
      columnsToExclude.forEach(column => {
        columnsToExcludeMap[column] = column;
      });
    }

    const columnsToDisplay = [];
    allColumns.forEach(column => {
      const columnId = column.accessor;
      const excludeColumn = Boolean(columnsToExcludeMap[columnId]);

      if (!excludeColumn) {
        columnsToDisplay.push(column);
      }
    });

    return columnsToDisplay;
  }, [showCustomer, columnsToExclude]);

  const data = useMemo(() => {
    return bookings.map(booking => {
      const { total, downPayment, item, paymentsReceived, startDate, endDate } =
        booking;
      const imprest = downPayment?.amount || 0;

      let balance = booking?.balance || 0;
      let paymentAmount = 0;
      if (paymentId) {
        balance = getBookingBalance(booking, paymentId);
        paymentAmount = paymentsReceived[paymentId];
      }

      return {
        ...booking,
        car: <Text textTransform="uppercase">{item?.name || ''}</Text>,
        total: Number(total).toLocaleString(),
        balance: Number(balance).toLocaleString(),
        imprest: Number(imprest).toLocaleString(),
        dueDate: <DueDateStatus booking={booking || {}} />,
        date: <BookingDates startDate={startDate} endDate={endDate} />,
        // date: <bookingDates booking={booking} />,
        paymentAmount: Number(paymentAmount).toLocaleString(),
        paymentInput: (
          <BookingPaymentInput
            booking={booking}
            formIsDisabled={false}
            paymentTotal={paymentTotal}
            paymentId={paymentId}
            balance={balance}
          />
        ),
        actions: <BookingOptions booking={booking} edit view deletion />,

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
    });
  }, [bookings, paymentId, paymentTotal]);

  return <CustomRawTable data={data} columns={columns} />;
}

BookingsTable.propTypes = {
  bookings: PropTypes.arrayOf(bookingProps),
  showCustomer: PropTypes.bool,
  paymentTotal: PropTypes.number,
  paymentId: PropTypes.string,
  formIsDisabled: PropTypes.bool,
  columnsToExclude: PropTypes.arrayOf(PropTypes.string),
};

export default BookingsTable;

// function bookingTableActions(props) {
//   const { booking } = props;

//   const { details } = useDeletebooking(booking);

//   const { bookingId } = booking;

//   return (
//     <TableActions
//       viewRoute={`${bookingId}/view`}
//       deleteDialog={{ ...details }}
//     />
//   );
// }
