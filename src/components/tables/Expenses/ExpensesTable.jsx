import { useMemo } from "react";
import PropTypes from "prop-types";

// import useDeletesalesReceipt from "../../../hooks/useDeletesalesReceipt";
// import SalesReceiptOptions from "../../../containers/Management/SalesReceipts/SalesReceiptOptions";

import CustomTable from "../CustomTable";
// import TableActions from "../TableActions";

function ExpensesTable(props) {
  const { expenses } = props;
  // console.log({ expenses });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "DATE", accessor: "date" },
      { Header: "EXPENSE ACCOUNT", accessor: "expenseAccount.name" },
      { Header: "VENDOR", accessor: "vendor.displayName" },
      { Header: "PAID THROUGH", accessor: "paymentAccount.name" },
      { Header: "CUSTOMER", accessor: "customer.displayName" },
      // { Header: "PAYMENT MODE", accessor: "paymentMode.name" },
      { Header: "REFERENCE", accessor: "reference" },
      { Header: "AMOUNT", accessor: "summary.totalAmount" },
    ];
  }, []);

  const data = useMemo(() => {
    return expenses.map((expense) => {
      const { receiptDate } = expense;

      return {
        ...expense,
        date: receiptDate.toDateString(),
        // actions: (
        //   <SalesReceiptOptions salesReceipt={expense} edit view deletion />
        // ),
      };
    });
  }, [expenses]);

  return <CustomTable data={data} columns={columns} />;
}

ExpensesTable.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      customer: PropTypes.shape({
        displayName: PropTypes.string.isRequired,
        companyName: PropTypes.string,
      }),
      summary: PropTypes.shape({
        totalAmount: PropTypes.number.isRequired,
      }),
      receiptDate: PropTypes.instanceOf(Date).isRequired,
      status: PropTypes.string.isRequired,
      expenseId: PropTypes.string.isRequired,
    })
  ),
};

export default ExpensesTable;
