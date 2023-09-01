import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { CREATE_EXPENSE } from '../../actions/expensesActions';
import { start, success, fail } from '../../slices/expenseSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { RootState, ExpenseFormData, Org } from '../../../types';

function* createExpenseSaga(action: PayloadAction<ExpenseFormData>) {
  yield put(start(CREATE_EXPENSE));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  async function create() {
    return httpsCallable(
      functions,
      'purchase-expense-create'
    )({ orgId, formData: action.payload });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess('Expense created Sucessfully!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateExpense() {
  yield takeLatest(CREATE_EXPENSE, createExpenseSaga);
}
