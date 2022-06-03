import { useMemo } from "react";
import PropTypes from "prop-types";
import { Box, Text } from "@chakra-ui/react";

import CustomTable from "../CustomTable";
import TableActions from "../TableActions";

import InvoiceDates from "./InvoiceDates";

import getInvoiceStatus from "../../../utils/invoices/getInvoiceStatus";
function InvoicesTable(props) {
  const { invoices, deleting, isDeleted, handleDelete } = props;
  // console.log({ invoices });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "Date", accessor: "date" },
      { Header: "Invoice#", accessor: "invoiceSlug" },
      { Header: "Customer", accessor: "customer.displayName" },
      { Header: "Status", accessor: "status" },
      { Header: "Amount", accessor: "summary.totalAmount" },
      //   { Header: "Opening Balance", accessor: "openingBalance" },
    ];
  }, []);

  const data = useMemo(() => {
    return invoices.map((invoice) => {
      const { invoiceId, customer, invoiceDate, invoiceSlug } = invoice;

      return {
        ...invoice,
        status: getInvoiceStatus(invoice).message,
        date: <InvoiceDates invoice={invoice} />,
        actions: (
          <TableActions
            viewRoute={`${invoiceId}/view`}
            deleteDialog={{
              isDeleted: isDeleted,
              title: "Delete Invoice",
              onConfirm: () => handleDelete(invoiceId),
              loading: deleting,
              message: (
                <Box>
                  <Text>Are you sure you want to delete this Invoice</Text>
                  <Box p={1} pl={5}>
                    <Text>
                      Invoice#: <b>{invoiceSlug}</b>
                    </Text>
                    <Text>
                      Customer Name: <b>{customer.displayName}</b>
                    </Text>
                    <Text>
                      Invoice Date :{" "}
                      <b>
                        {new Date(invoiceDate.seconds * 1000).toDateString()}
                      </b>
                    </Text>
                  </Box>
                  <Text>NOTE:::THIS ACTION CANNOT BE UNDONE!</Text>
                </Box>
              ),
            }}
          />
        ),
      };
    });
  }, [invoices, deleting, isDeleted, handleDelete]);

  return <CustomTable data={data} columns={columns} />;
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
  deleting: PropTypes.bool.isRequired,
  isDeleted: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default InvoicesTable;
