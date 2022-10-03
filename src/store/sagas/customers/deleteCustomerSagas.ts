import { put, call, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { httpsCallable } from 'firebase/functions';

import { functions } from '../../../utils/firebase';

import { DELETE_CUSTOMER } from '../../actions/customersActions';
import { start, success, fail } from '../../slices/customersSlice';
import {
  success as toastSuccess,
  error as toastError,
} from '../../slices/toastSlice';

import { RootState } from '../../../types';

function* deleteCustomer(action: PayloadAction<string>) {
  yield put(start(DELETE_CUSTOMER));
  const customerId = action.payload;

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function update() {
    return httpsCallable(
      functions,
      'sales-customer-delete'
    )({ orgId, customerId });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Customer Deleted successfully!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteCustomer() {
  yield takeLatest(DELETE_CUSTOMER, deleteCustomer);
}
