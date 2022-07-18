import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconButton } from "@chakra-ui/react";
import { RiCloseLine } from "react-icons/ri";
import { connect } from "react-redux";

import { EXPENSES } from "../../../nav/routes";

import { CREATE_EXPENSE } from "../../../store/actions/expensesActions";
import { reset } from "../../../store/slices/expenseSlice";

import PageLayout from "../../../components/layout/PageLayout";
import EditExpense from "../../../containers/Management/Expenses/EditExpense";

function NewExpensePage(props) {
  const { createExpense, loading, isModified, resetExpense } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (isModified) {
      resetExpense();
      navigate(EXPENSES);
    }
  }, [isModified, resetExpense, navigate]);

  return (
    <PageLayout
      pageTitle="New Expense"
      actions={
        <Link to={-1}>
          <IconButton
            colorScheme="red"
            variant="outline"
            size="sm"
            title="cancel"
            icon={<RiCloseLine />}
          />
        </Link>
      }
    >
      <EditExpense updating={loading} handleFormSubmit={createExpense} />
    </PageLayout>
  );
}

function mapStateToProps(state) {
  let { loading, action, isModified } = state.expensesReducer;
  loading = loading && action === CREATE_EXPENSE;

  return {
    loading,
    isModified,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createExpense: (payload) => dispatch({ type: CREATE_EXPENSE, payload }),
    resetExpense: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewExpensePage);
