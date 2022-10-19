import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { DELETE_EXPENSE } from '../../actions/expensesActions';
import { start, success, fail } from '../../slices/expenseSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { RootState } from '../../../types';

function* deleteExpenseSaga(action: PayloadAction<string>) {
  yield put(start(DELETE_EXPENSE));
  const expenseId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function update() {
    return httpsCallable(
      functions,
      'purchase-expense-delete'
    )({ orgId, expenseId });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Expense Sucessfully DELETED!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteExpense() {
  yield takeLatest(DELETE_EXPENSE, deleteExpenseSaga);
}
