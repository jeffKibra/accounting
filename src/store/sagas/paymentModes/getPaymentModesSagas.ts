import { call, takeLatest, select, put } from 'redux-saga/effects';
import { doc, getDoc } from 'firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';

import { db } from '../../../utils/firebase';

import { GET_PAYMENT_MODES } from '../../actions/paymentModesActions';
import {
  start,
  fail,
  paymentModesSuccess,
} from '../../slices/paymentModesSlice';
import { error as toastError } from '../../slices/toastSlice';

import { RootState, PaymentMode } from '../../../types';

function* getPaymentModes(action: PayloadAction) {
  async function get(orgId: string) {
    const modesDoc = await getDoc(
      doc(db, 'organizations', orgId, 'orgDetails', 'paymentModes')
    );
    if (!modesDoc.exists) {
      throw new Error('Payments modes not found!');
    }
    const modesData = modesDoc.data() as { [key: string]: PaymentMode };

    return modesData;
  }

  try {
    const { type } = action;

    yield put(start(type));

    const orgId: string = yield select(
      (state: RootState) => state.orgsReducer.org?.orgId
    );

    const paymentModes: Record<string, PaymentMode> = yield call(get, orgId);
    // console.log({ paymentModes });

    yield put(paymentModesSuccess(paymentModes));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetPaymentModes() {
  yield takeLatest(GET_PAYMENT_MODES, getPaymentModes);
}
