import { useEffect } from "react";
import { connect } from "react-redux";

import { GET_EXPENSES } from "../../../store/actions/expensesActions";
import { reset } from "../../../store/slices/expenseSlice";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import ExpensesTable from "../../../components/tables/Expenses/ExpensesTable";

function Expenses(props) {
  const { loading, expenses, isModified, getExpenses, resetExpense } = props;
  console.log({ expenses });
  useEffect(() => {
    getExpenses();
  }, [getExpenses]);

  useEffect(() => {
    if (isModified) {
      resetExpense();
      getExpenses();
    }
  }, [isModified, resetExpense, getExpenses]);

  return loading ? (
    <SkeletonLoader />
  ) : expenses?.length > 0 ? (
    <ExpensesTable expenses={expenses} />
  ) : (
    <Empty />
  );
}

function mapStateToProps(state) {
  let { loading, expenses, action, isModified } = state.expensesReducer;
  loading = loading && action === GET_EXPENSES;

  return { loading, expenses, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    getExpenses: () => dispatch({ type: GET_EXPENSES }),
    resetExpense: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Expenses);
