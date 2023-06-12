import { useMemo } from 'react';
import PropTypes from 'prop-types';
// import { Text } from '@chakra-ui/react';

// import useDeletebooking from "../../../hooks/useDeletebooking";
import BookingOptions from '../../../containers/Management/Bookings/BookingOptions';

import CustomRawTable from '../CustomRawTable';
// import TableActions from "../TableActions";

// import bookingDates from './bookingDates';
import BookingDates from './BookingDates';
import DueDateStatus from './DueDateStatus';

function BookingsTable(props) {
  const { bookings, showCustomer } = props;
  // console.log({ bookings });

  const columns = useMemo(() => {
    return [
      { Header: 'Booking Dates', accessor: 'date' },
      { Header: 'Days', accessor: 'quantity', isNumeric: true },
      // { Header: 'Booking#', accessor: 'id', isNumeric: true },
      ...(showCustomer
        ? [{ Header: 'Customer', accessor: 'customer.displayName' }]
        : []),
      // { Header: 'Status', accessor: 'status' },

      { Header: 'Payments Due', accessor: 'dueDate' },
      { Header: 'Total', accessor: 'total', isNumeric: true },
      { Header: 'Imprest', accessor: 'imprest', isNumeric: true },
      // { Header: 'Payments', accessor: 'payments' },
      { Header: 'Balance', accessor: 'balance', isNumeric: true },
      { Header: '', accessor: 'actions' },
    ];
  }, [showCustomer]);

  const data = useMemo(() => {
    return bookings.map(booking => {
      const { total, downPayment, balance } = booking;
      const imprest = downPayment?.amount || 0;

      return {
        ...booking,
        total: Number(total).toLocaleString(),
        balance: Number(balance).toLocaleString(),
        imprest: Number(imprest).toLocaleString(),
        dueDate: <DueDateStatus booking={booking || {}} />,
        date: <BookingDates dateRange={booking?.dateRange || []} />,
        // date: <bookingDates booking={booking} />,
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
  }, [bookings]);

  return <CustomRawTable data={data} columns={columns} />;
}

BookingsTable.propTypes = {
  bookings: PropTypes.arrayOf(
    PropTypes.shape({
      customer: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        companyName: PropTypes.string,
      }),
      balance: PropTypes.number,
      total: PropTypes.number,
      saleDate: PropTypes.instanceOf(Date).isRequired,
      dueDate: PropTypes.instanceOf(Date).isRequired,
      status: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
    })
  ),
  showCustomer: PropTypes.bool,
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
