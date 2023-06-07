import { useMemo } from 'react';
import PropTypes from 'prop-types';
// import { Text } from '@chakra-ui/react';

// import useDeleteInvoice from "../../../hooks/useDeleteInvoice";
import InvoiceOptions from '../../../containers/Management/Invoices/InvoiceOptions';

import CustomRawTable from '../CustomRawTable';
// import TableActions from "../TableActions";

// import InvoiceDates from './InvoiceDates';
import BookingDates from './BookingDates';
import DueDateStatus from './DueDateStatus';

function InvoicesTable(props) {
  const { invoices, showCustomer } = props;
  // console.log({ invoices });

  const columns = useMemo(() => {
    return [
      { Header: 'Booking Dates', accessor: 'date' },
      { Header: 'Days', accessor: 'quantity', isNumeric: true },
      { Header: 'Invoice#', accessor: 'invoiceId', isNumeric: true },
      ...(showCustomer
        ? [{ Header: 'Customer', accessor: 'customer.displayName' }]
        : []),
      // { Header: 'Status', accessor: 'status' },

      { Header: 'Payments Due', accessor: 'dueDate' },
      { Header: 'Total', accessor: 'total', isNumeric: true },
      // { Header: 'Payments', accessor: 'payments' },
      { Header: 'Balance', accessor: 'balance', isNumeric: true },
      { Header: '', accessor: 'actions' },
    ];
  }, [showCustomer]);

  const data = useMemo(() => {
    return invoices.map(invoice => {
      return {
        ...invoice,

        dueDate: <DueDateStatus invoice={invoice || {}} />,
        date: <BookingDates dateRange={invoice?.dateRange || []} />,
        // date: <InvoiceDates invoice={invoice} />,
        actions: <InvoiceOptions invoice={invoice} edit view deletion />,
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
  }, [invoices]);

  return <CustomRawTable data={data} columns={columns} />;
}

InvoicesTable.propTypes = {
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      customer: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        companyName: PropTypes.string,
      }),
      summary: PropTypes.shape({
        totalAmount: PropTypes.number.isRequired,
      }),
      saleDate: PropTypes.instanceOf(Date).isRequired,
      dueDate: PropTypes.instanceOf(Date).isRequired,
      status: PropTypes.number.isRequired,
      invoiceId: PropTypes.string.isRequired,
    })
  ),
  showCustomer: PropTypes.bool,
};

export default InvoicesTable;

// function InvoiceTableActions(props) {
//   const { invoice } = props;

//   const { details } = useDeleteInvoice(invoice);

//   const { invoiceId } = invoice;

//   return (
//     <TableActions
//       viewRoute={`${invoiceId}/view`}
//       deleteDialog={{ ...details }}
//     />
//   );
// }
