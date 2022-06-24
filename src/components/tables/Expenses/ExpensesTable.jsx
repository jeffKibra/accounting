import { useMemo } from "react";
import PropTypes from "prop-types";

// import useDeletesalesReceipt from "../../../hooks/useDeletesalesReceipt";
// import SalesReceiptOptions from "../../../containers/Management/SalesReceipts/SalesReceiptOptions";
import ExpenseOptions from "../../../containers/Management/Expenses/ExpenseOptions";

import CustomTable from "../CustomTable";
// import TableActions from "../TableActions";

function ExpensesTable(props) {
  const { expenses } = props;
  // console.log({ expenses });

  const columns = useMemo(() => {
    return [
      { Header: "", accessor: "actions" },
      { Header: "DATE", accessor: "date" },
      { Header: "EXPENSE ACCOUNT", accessor: "expenseAccount" },
      { Header: "PAID THROUGH", accessor: "paymentAccount.name" },
      // { Header: "CUSTOMER", accessor: "customer.displayName" },
      // { Header: "PAYMENT MODE", accessor: "paymentMode.name" },
      { Header: "REFERENCE", accessor: "reference" },
      { Header: "VENDOR", accessor: "vendor.displayName" },
      { Header: "AMOUNT", accessor: "summary.totalAmount", isNumeric: true },
    ];
  }, []);

  const data = useMemo(() => {
    return expenses.map((expense) => {
      const { expenseDate, items } = expense;
      let expenseAccount = items[0]?.account?.name;
      if (items.length > 1) {
        expenseAccount = "Split";
      }

      return {
        ...expense,
        expenseAccount,
        date: expenseDate.toDateString(),
        actions: <ExpenseOptions expense={expense} edit deletion />,
      };
    });
  }, [expenses]);

  return <CustomTable data={data} columns={columns} />;
}

ExpensesTable.propTypes = {
  expenses: PropTypes.arrayOf(
    PropTypes.shape({
      vendor: PropTypes.shape({
        displayName: PropTypes.string,
        companyName: PropTypes.string,
      }),
      summary: PropTypes.shape({
        totalAmount: PropTypes.number.isRequired,
      }),
      expenseDate: PropTypes.instanceOf(Date).isRequired,
      status: PropTypes.string.isRequired,
      expenseId: PropTypes.string.isRequired,
      paymentAccount: PropTypes.shape({
        accountId: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
      reference: PropTypes.string,
    })
  ),
};

export default ExpensesTable;
