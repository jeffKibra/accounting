import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  UPDATE_EXPENSE,
  GET_EXPENSE,
} from '../../../store/actions/expensesActions';
import { reset } from '../../../store/slices/expenseSlice';

import { EXPENSES } from '../../../nav/routes';

import useSavedLocation from '../../../hooks/useSavedLocation';
import PageLayout from '../../../components/layout/PageLayout';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import EditExpense from '../../../containers/Management/Expenses/EditExpense';

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
  const location = useLocation();
  useSavedLocation().setLocation();
  const viewRoute = `/purchase/expenses/${expenseId}/view`;

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
      breadcrumbLinks={{
        Dashboard: '/',
        Expenses: EXPENSES,
        [expenseId]: location.pathname,
      }}
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
    updateExpense: payload => dispatch({ type: UPDATE_EXPENSE, payload }),
    resetExpense: () => dispatch(reset()),
    getExpense: expenseId =>
      dispatch({ type: GET_EXPENSE, payload: expenseId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditExpensePage);
