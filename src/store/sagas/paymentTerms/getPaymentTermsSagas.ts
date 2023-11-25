import { call, takeLatest, select, put } from 'redux-saga/effects';
import { doc, getDoc } from 'firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';

import { db } from '../../../utils/firebase';

import { GET_PAYMENT_TERMS } from '../../actions/paymentTermsActions';
import {
  start,
  fail,
  paymentTermsSuccess,
} from '../../slices/paymentTermsSlice';
import { error as toastError } from '../../slices/toastSlice';

import { RootState, PaymentTerm } from '../../../types';

function* getPaymentTerms(action: PayloadAction) {
  const { type } = action;
  yield put(start(type));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?._id
  );

  async function get() {
    const termsDoc = await getDoc(
      doc(db, 'organizations', orgId, 'orgDetails', 'paymentTerms')
    );
    if (!termsDoc.exists) {
      throw new Error('Payments Terms not found!');
    }
    const termsData = termsDoc.data() as { [key: string]: PaymentTerm };
    const terms = Object.keys(termsData).map(key => {
      return { ...termsData[key] };
    });
    terms.sort((a, b) => a.days - b.days);

    return terms;
  }
  try {
    const paymentTerms: PaymentTerm[] = yield call(get);
    // console.log({ paymentTerms });

    yield put(paymentTermsSuccess(paymentTerms));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetPaymentTerms() {
  yield takeLatest(GET_PAYMENT_TERMS, getPaymentTerms);
}
