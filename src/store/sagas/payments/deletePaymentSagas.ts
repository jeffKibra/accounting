import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { DELETE_PAYMENT } from '../../actions/paymentsActions';
import { start, success, fail } from '../../slices/paymentsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { RootState } from '../../../types';

function* deletePaymentSaga(action: PayloadAction<string>) {
  yield put(start(DELETE_PAYMENT));
  console.log({ action });
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function update() {
    return httpsCallable(
      functions,
      'sales-paymentsReceived-delete'
    )({ orgId, paymentId: action.payload });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Payment sucessfully deleted!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeletePayment() {
  yield takeLatest(DELETE_PAYMENT, deletePaymentSaga);
}
