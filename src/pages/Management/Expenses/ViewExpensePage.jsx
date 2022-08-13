import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import { GET_EXPENSE } from '../../../store/actions/expensesActions';
import { reset } from '../../../store/slices/expenseSlice';

import { EXPENSES } from '../../../nav/routes';

import useSavedLocation from '../../../hooks/useSavedLocation';

import PageLayout from '../../../components/layout/PageLayout';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

import ExpenseOptions from '../../../containers/Management/Expenses/ExpenseOptions';
import ViewExpense from '../../../containers/Management/Expenses/ViewExpense';

function ViewExpensePage(props) {
  const { loading, isModified, expense, action, resetExpense, getExpense } =
    props;
  const { expenseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  useSavedLocation().setLocation();

  useEffect(() => {
    getExpense(expenseId);
  }, [getExpense, expenseId]);

  useEffect(() => {
    if (isModified) {
      resetExpense();
      navigate(EXPENSES);
    }
  }, [isModified, resetExpense, navigate]);

  return (
    <PageLayout
      pageTitle="Expense Details"
      actions={expense && <ExpenseOptions expense={expense} edit deletion />}
      breadcrumbLinks={{
        Dashboard: '/',
        Expenses: EXPENSES,
        [expenseId]: location.pathname,
      }}
    >
      {loading && action === GET_EXPENSE ? (
        <SkeletonLoader />
      ) : expense ? (
        <ViewExpense expense={expense} />
      ) : (
        <Empty message="Expense not found!" />
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
    resetExpense: () => dispatch(reset()),
    getExpense: expenseId =>
      dispatch({ type: GET_EXPENSE, payload: expenseId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewExpensePage);
