import { useMemo } from "react";
import PropTypes from "prop-types";
import { Box, Text } from "@chakra-ui/react";

import CustomTable from "../CustomTable";
import TableActions from "../TableActions";

function PaymentsTable(props) {
  const { payments, deleting, isDeleted, handleDelete } = props;
  // console.log({ invoices });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "Date", accessor: "paymentDate" },
      { Header: "Payment#", accessor: "paymentSlug" },
      { Header: "Reference", accessor: "reference" },
      { Header: "Customer", accessor: "customer.displayName" },
      //   { Header: "Invoices", accessor: "invoices" },
      { Header: "Mode", accessor: "paymentMode.name" },
      { Header: "Amount", accessor: "amount", isNumeric: true },
      { Header: "Excess", accessor: "excess", isNumeric: true },
    ];
  }, []);

  const data = useMemo(() => {
    return payments.map((payment) => {
      const {
        paymentId,
        customer,
        paymentDate,
        paymentSlug,
        payments,
        amount,
      } = payment;
      const invoicesIds = payments ? Object.keys(payments) : [];
      const paymentsTotal = invoicesIds.reduce((sum, key) => {
        return sum + +payments[key];
      }, 0);
      const excess = amount - paymentsTotal;

      return {
        ...payment,
        invoices: [...invoicesIds].join(","),
        excess,
        paymentDate: new Date(paymentDate).toDateString(),
        actions: (
          <TableActions
            viewRoute={`${paymentId}/view`}
            deleteDialog={{
              isDeleted: isDeleted,
              title: "Delete payment",
              onConfirm: () => handleDelete(paymentId),
              loading: deleting,
              message: (
                <Box>
                  <Text>Are you sure you want to delete this payment</Text>
                  <Box p={1} pl={5}>
                    <Text>
                      Payment#: <b>{paymentSlug}</b>
                    </Text>
                    <Text>
                      Customer Name: <b>{customer.displayName}</b>
                    </Text>
                    <Text>
                      Payment Date : <b>{paymentDate}</b>
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
  }, [payments, deleting, isDeleted, handleDelete]);

  return <CustomTable data={data} columns={columns} />;
}

PaymentsTable.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      customer: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        companyName: PropTypes.string,
      }),
      amount: PropTypes.number.isRequired,
      reference: PropTypes.string,
      paymentSlug: PropTypes.string.isRequired,
      payments: PropTypes.object,
      paymentDate: PropTypes.string.isRequired,
      paymentMode: PropTypes.object.isRequired,
      account: PropTypes.object.isRequired,
      paymentId: PropTypes.string.isRequired,
    })
  ),
  deleting: PropTypes.bool.isRequired,
  isDeleted: PropTypes.bool.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default PaymentsTable;
