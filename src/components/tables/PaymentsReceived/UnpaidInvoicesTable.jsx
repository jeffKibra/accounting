import { useMemo } from 'react';
import PropTypes from 'prop-types';

import CustomRawTable from '../CustomRawTable';
import TableNumInput from '../../ui/TableNumInput';

import { getInvoiceBalance } from '../../../utils/invoices';

import InvoiceDates from '../Invoices/InvoiceDates';

// import { RiEdit2Line } from "react-icons/ri";
// import CustomModal from "../../ui/CustomModal";
// import EditInvoicePaymentForm from "../../forms/PaymentsReceived/EditInvoicePaymentForm";

function UnpaidInvoicesTable(props) {
  const {
    invoices,
    paymentId,
    amount,
    loading,
    // taxDeducted,
  } = props;
  // console.log({ props });

  const columns = useMemo(() => {
    return [
      // { Header: "", accessor: "actions" },
      { Header: 'Date', accessor: 'invoiceDate' },
      { Header: 'Invoice#', accessor: 'invoiceId' },
      { Header: 'Amount', accessor: 'summary.totalAmount', isNumeric: true },
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
    return invoices.map(invoice => {
      const { invoiceId, transactionType } = invoice;
      const balance = getInvoiceBalance(invoice, paymentId);
      const max = Math.min(amount, balance);
      // console.log({
      //   paymentId,
      //   max,
      //   amount,
      //   balance,
      //   pp: invoice.payments,
      // });

      return {
        ...invoice,
        invoiceId: transactionType === 'invoice' ? invoiceId : transactionType,
        balance,
        payment: (
          <TableNumInput
            name={invoiceId}
            // defaultValue={payment}
            min={0}
            max={max}
            loading={loading}
          />
        ),
        invoiceDate: <InvoiceDates invoice={invoice} />,
      };
    });
  }, [invoices, paymentId, amount, loading]);

  return (
    <CustomRawTable
      data={data}
      columns={columns}
      caption="The Excess amount is added to the customers account!"
    />
  );
}

UnpaidInvoicesTable.propTypes = {
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      customer: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        companyName: PropTypes.string,
      }),
      summary: PropTypes.shape({
        totalAmount: PropTypes.number.isRequired,
      }),
      invoiceDate: PropTypes.instanceOf(Date).isRequired,
      dueDate: PropTypes.instanceOf(Date).isRequired,
      status: PropTypes.number.isRequired,
      invoiceId: PropTypes.string.isRequired,
    })
  ),
  paymentId: PropTypes.string,
  amount: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  // taxDeducted: PropTypes.oneOf(["yes", "no"]),
};

export default UnpaidInvoicesTable;

// actions: (
//   <CustomModal
//     title={`Payment ${invoiceSlug}`}
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
//         <EditInvoicePaymentForm
//           onClose={onClose}
//           handleFormSubmit={editPayment}
//           invoice={invoice}
//           summary={summary}
//           paymentId={paymentId}
//           taxDeducted={taxDeducted}
//         />
//       );
//     }}
//   />
// ),
