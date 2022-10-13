import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { CREATE_PAYMENT } from '../../actions/paymentsActions';
import { start, success, fail } from '../../slices/paymentsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { Org, PaymentReceivedForm, RootState } from '../../../types';

function* createPaymentSaga(action: PayloadAction<PaymentReceivedForm>) {
  yield put(start(CREATE_PAYMENT));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  async function create() {
    return httpsCallable(
      functions,
      'sales-paymentReceived-create'
    )({ orgId, formData: action.payload });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess('Payment sucessfully created!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreatePayment() {
  yield takeLatest(CREATE_PAYMENT, createPaymentSaga);
}
