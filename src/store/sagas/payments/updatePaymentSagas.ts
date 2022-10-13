import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';
import { UPDATE_PAYMENT } from '../../actions/paymentsActions';
import { start, success, fail } from '../../slices/paymentsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { RootState, PaymentReceivedForm } from '../../../types';

interface UpdateData extends PaymentReceivedForm {
  paymentId: string;
}

function* updatePaymentSaga(action: PayloadAction<UpdateData>) {
  yield put(start(UPDATE_PAYMENT));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  const { paymentId, ...formData } = action.payload;

  async function update() {
    return httpsCallable(
      functions,
      'sales-paymentReceived-update'
    )({ orgId, paymentId, formData });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Payment sucessfully updated!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdatePayment() {
  yield takeLatest(UPDATE_PAYMENT, updatePaymentSaga);
}
