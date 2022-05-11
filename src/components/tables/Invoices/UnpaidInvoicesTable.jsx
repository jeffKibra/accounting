import { useMemo } from "react";
import PropTypes from "prop-types";
import { Text, IconButton, Flex, VStack, Button } from "@chakra-ui/react";

import { RiEdit2Line } from "react-icons/ri";

import CustomModal from "../../ui/CustomModal";
import CustomTable from "../CustomTable";

import EditInvoicePaymentForm from "../../forms/PaymentsReceived/EditInvoicePaymentForm";

function UnpaidInvoicesTable(props) {
  const {
    invoices,
    summary,
    taxDeducted,
    editInvoicePayment,
    autoPay,
    paymentId,
  } = props;
  console.log({ props });
  // console.log({ invoices });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "Date", accessor: "invoiceDate" },
      { Header: "Invoice#", accessor: "invoiceSlug" },
      { Header: "Amount", accessor: "summary.totalAmount" },
      { Header: "Amount Due", accessor: "summary.balance" },
      ...(taxDeducted === "yes"
        ? [{ Header: "Withholding Tax", accessor: "withholdingTax" }]
        : []),
      { Header: "Payment", accessor: "latestPayment" },
      //   { Header: "Opening Balance", accessor: "openingBalance" },
    ];
  }, [taxDeducted]);

  const data = useMemo(() => {
    return invoices.map((invoice) => {
      const { invoiceId, invoiceDate, dueDate, invoiceSlug } = invoice;
      const overDue = Date.now() - new Date(dueDate).getTime() > 0;
      const latestPayment =
        invoice.payments.find((payment) => payment.paymentId === paymentId)
          ?.amount || 0;

      function editPayment(data) {
        console.log({ data });
        editInvoicePayment({
          ...data,
          invoiceId,
        });
      }

      return {
        ...invoice,
        latestPayment,
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
        actions: (
          <CustomModal
            title={`Payment ${invoiceSlug}`}
            closeOnOverlayClick={false}
            renderTrigger={(onOpen) => {
              return (
                <IconButton
                  size="xs"
                  colorScheme="cyan"
                  onClick={onOpen}
                  icon={<RiEdit2Line />}
                  title="edit balance"
                />
              );
            }}
            renderContent={(onClose) => {
              return (
                <EditInvoicePaymentForm
                  onClose={onClose}
                  handleFormSubmit={editPayment}
                  invoice={invoice}
                  summary={summary}
                  paymentId={paymentId}
                  taxDeducted={taxDeducted}
                />
              );
            }}
          />
        ),
      };
    });
  }, [invoices, editInvoicePayment, paymentId, summary, taxDeducted]);

  return (
    <VStack w="full">
      <Flex justify="flex-end" w="full">
        <Button
          onClick={autoPay}
          colorScheme="cyan"
          variant="outline"
          size="xs"
        >
          auto pay
        </Button>
      </Flex>
      <CustomTable
        data={data}
        columns={columns}
        caption="The Excess amount is added to the customers account!"
      />
    </VStack>
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
  summary: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    paidAmount: PropTypes.number.isRequired,
    excess: PropTypes.number.isRequired,
  }),
  paymentId: PropTypes.string.isRequired,
  editInvoicePayment: PropTypes.func.isRequired,
  autoPay: PropTypes.func.isRequired,
  taxDeducted: PropTypes.oneOf(["yes", "no"]).isRequired,
};

export default UnpaidInvoicesTable;
