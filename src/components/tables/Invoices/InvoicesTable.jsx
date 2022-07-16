import { useMemo } from "react";
import PropTypes from "prop-types";
import { Text } from "@chakra-ui/react";

// import useDeleteInvoice from "../../../hooks/useDeleteInvoice";
import InvoiceOptions from "../../../containers/Management/Invoices/InvoiceOptions";

import CustomRawTable from "../CustomRawTable";
// import TableActions from "../TableActions";

import InvoiceDates from "./InvoiceDates";

import { getInvoiceStatus } from "../../../utils/invoices";
function InvoicesTable(props) {
  const { invoices, showCustomer } = props;
  // console.log({ invoices });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "Date", accessor: "date" },
      { Header: "Invoice#", accessor: "invoiceId" },
      ...(showCustomer
        ? [{ Header: "Customer", accessor: "customer.displayName" }]
        : []),
      { Header: "Status", accessor: "status" },
      { Header: "Amount", accessor: "summary.totalAmount", isNumeric: true },
      { Header: "Balance", accessor: "balance", isNumeric: true },
    ];
  }, [showCustomer]);

  const data = useMemo(() => {
    return invoices.map((invoice) => {
      const { message, status } = getInvoiceStatus(invoice);

      return {
        ...invoice,
        status: (
          <Text
            fontSize="sm"
            color={
              status === "OVERDUE"
                ? "red"
                : status === "PARTIALLY PAID" || status === "PAID"
                ? "green"
                : "blue"
            }
          >
            {message}
          </Text>
        ),
        date: <InvoiceDates invoice={invoice} />,
        actions: <InvoiceOptions invoice={invoice} edit view deletion />,
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
      invoiceDate: PropTypes.instanceOf(Date).isRequired,
      dueDate: PropTypes.instanceOf(Date).isRequired,
      status: PropTypes.string.isRequired,
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
