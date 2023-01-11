import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';

import InvoiceDates from 'components/tables/Invoices/InvoiceDates';
import CustomRawTable from 'components/tables/CustomRawTable';
import ControlledNumInput from 'components/ui/ControlledNumInput';

import { getInvoiceBalance } from 'utils/invoices';

// import { RiEdit2Line } from "react-icons/ri";
// import CustomModal from "../../ui/CustomModal";
// import EditInvoicePaymentForm from "../../forms/PaymentsReceived/EditInvoicePaymentForm";

function UnpaidInvoicesTable(props) {
  const {
    invoices,
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
          <Controller
            name={`payments.${invoiceId}`}
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
        invoiceDate: <InvoiceDates invoice={invoice} />,
      };
    });
  }, [invoices, paymentId, amount, formIsDisabled, control]);

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
