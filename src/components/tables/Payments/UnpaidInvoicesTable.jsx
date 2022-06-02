import { useMemo } from "react";
import PropTypes from "prop-types";
import { Text } from "@chakra-ui/react";

import CustomTable from "../CustomTable";
import TableNumInput from "../../ui/TableNumInput";

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
      { Header: "Date", accessor: "invoiceDate" },
      { Header: "Invoice#", accessor: "invoiceSlug" },
      { Header: "Amount", accessor: "summary.totalAmount", isNumeric: true },
      { Header: "Amount Due", accessor: "balance", isNumeric: true },
      // ...(taxDeducted === "yes"
      //   ? [{ Header: "Withholding Tax", accessor: "withholdingTax" }]
      //   : []),
      {
        Header: "Payment",
        accessor: "payment",
        width: "16%",
        isNumeric: true,
      },
    ];
  }, []);

  const data = useMemo(() => {
    return invoices.map((invoice) => {
      const { invoiceId, invoiceDate, dueDate, balance } = invoice;
      const overDue = Date.now() - new Date(dueDate).getTime() > 0;
      const payment = invoice.payments[paymentId]?.amount || 0;
      const currentBalance = balance + payment;
      const max = Math.min(amount, currentBalance);
      // console.log({ max, summary, amount, payment });

      return {
        ...invoice,
        payment: (
          <TableNumInput
            name={invoiceId}
            // defaultValue={payment}
            min={0}
            max={max}
            loading={loading}
          />
        ),
        invoiceDate: (
          <>
            {new Date(invoiceDate).toDateString()} <br />{" "}
            {overDue ? (
              <Text color="red" fontSize="xs">
                OVERDUE
              </Text>
            ) : (
              <Text fontSize="xs">
                Due Date: {new Date(dueDate).toDateString()}
              </Text>
            )}{" "}
          </>
        ),
      };
    });
  }, [invoices, paymentId, amount, loading]);

  return (
    <CustomTable
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
      invoiceDate: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
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
