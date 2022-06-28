import { useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { connect } from "react-redux";
import { IconButton } from "@chakra-ui/react";
import { RiCloseFill } from "react-icons/ri";

import {
  UPDATE_EXPENSE,
  GET_EXPENSE,
} from "../../../store/actions/expensesActions";
import { reset } from "../../../store/slices/expenseSlice";

import useSavedLocation from "../../../hooks/useSavedLocation";
import PageLayout from "../../../components/layout/PageLayout";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import EditExpense from "../../../containers/Management/Expenses/EditExpense";

function getFormValuesOnly(expense = {}) {
  const {
    vendor,
    expenseDate,
    expenseId,
    paymentAccount,
    paymentMode,
    reference,
    summary,
    items,
    taxType,
  } = expense;

  return {
    vendor,
    expenseDate,
    expenseId,
    paymentAccount,
    paymentMode,
    reference,
    summary,
    items,
    taxType,
  };
}

function EditExpensePage(props) {
  const {
    loading,
    action,
    isModified,
    expense,
    updateExpense,
    resetExpense,
    getExpense,
  } = props;
  const { expenseId } = useParams();
  const navigate = useNavigate();
  useSavedLocation().setLocation();
  const viewRoute = `/expenses/${expenseId}/view`;

  useEffect(() => {
    getExpense(expenseId);
  }, [getExpense, expenseId]);

  useEffect(() => {
    if (isModified) {
      resetExpense();
      navigate(viewRoute);
    }
  }, [isModified, resetExpense, navigate, viewRoute]);

  function update(data) {
    updateExpense({
      ...data,
      expenseId,
    });
  }

  return (
    <PageLayout
      pageTitle="Edit Expense"
      actions={
        <Link to={-1}>
          <IconButton
            colorScheme="red"
            variant="outline"
            size="sm"
            title="cancel"
            icon={<RiCloseFill />}
          />
        </Link>
      }
    >
      {loading && action === GET_EXPENSE ? (
        <SkeletonLoader />
      ) : expense ? (
        <EditExpense
          updating={loading && action === UPDATE_EXPENSE}
          handleFormSubmit={update}
          expense={getFormValuesOnly(expense)}
        />
      ) : (
        <Empty message="Expense data not found!" />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, isModified, expense } = state.expensesReducer;

  return { loading, action, isModified, expense };
}

function mapDispatchToProps(dispatch) {
  return {
    updateExpense: (data) => dispatch({ type: UPDATE_EXPENSE, data }),
    resetExpense: () => dispatch(reset()),
    getExpense: (expenseId) => dispatch({ type: GET_EXPENSE, expenseId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditExpensePage);
