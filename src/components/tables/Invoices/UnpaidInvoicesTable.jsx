import { useMemo } from "react";
import PropTypes from "prop-types";
import { Box, Text, Stack, IconButton } from "@chakra-ui/react";

import { RiEdit2Line } from "react-icons/ri";

import CustomModal from "../../ui/CustomModal";
import CustomTable from "../CustomTable";

import InvoicePaymentForm from "../../forms/PaymentsReceived/InvoicePaymentForm";

function UnpaidInvoicesTable(props) {
  const { invoices } = props;
  // console.log({ invoices });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "Date", accessor: "invoiceDate" },
      { Header: "Due Date", accessor: "dueDate" },
      { Header: "Invoice#", accessor: "invoiceSlug" },
      { Header: "Status", accessor: "status" },
      { Header: "Amount", accessor: "summary.totalAmount" },
      { Header: "Amount Due", accessor: "summary.amountDue" },
      //   { Header: "Opening Balance", accessor: "openingBalance" },
    ];
  }, []);

  const data = useMemo(() => {
    return invoices.map((invoice) => {
      const { invoiceId, invoiceDate, invoiceSlug } = invoice;

      return {
        ...invoice,
        actions: (
          <CustomModal
            closeOnOverlayClick={false}
            renderTrigger={(onOpen) => {
              return <IconButton icon={<RiEdit2Line />} title="edit balance" />;
            }}
            renderContent={(onClose) => {
              return (
                <InvoicePaymentForm
                  handleFormSubmit={(data) => console.log({ data })}
                />
              );
            }}
          />
        ),
      };
    });
  }, [invoices]);

  return <CustomTable data={data} columns={columns} />;
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
};

export default UnpaidInvoicesTable;
