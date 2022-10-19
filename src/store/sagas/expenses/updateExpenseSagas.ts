import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { UPDATE_EXPENSE } from '../../actions/expensesActions';
import { start, success, fail } from '../../slices/expenseSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { ExpenseFormData, RootState } from '../../../types';

interface updateData extends ExpenseFormData {
  expenseId: string;
}

function* updateExpenseSaga(action: PayloadAction<updateData>) {
  yield put(start(UPDATE_EXPENSE));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  const { expenseId, ...formData } = action.payload;

  async function update() {
    return httpsCallable(
      functions,
      'purchase-expense-update'
    )({
      orgId,
      expenseId,
      formData,
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Expense Sucessfully Updated!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateExpense() {
  yield takeLatest(UPDATE_EXPENSE, updateExpenseSaga);
}
