import { call, takeLatest, select, put } from "redux-saga/effects";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { GET_PAYMENT_TERMS } from "../../actions/paymentTermsActions";
import {
  start,
  fail,
  paymentTermsSuccess,
} from "../../slices/paymentTermsSlice";
import { error as toastError } from "../../slices/toastSlice";

function* getPaymentTerms({ type }) {
  try {
    yield put(start(type));
    const orgId = yield select((state) => state.orgsReducer.org?.id);

    async function get() {
      const termsDoc = await getDoc(
        doc(db, "organizations", orgId, "orgDetails", "paymentTerms")
      );
      if (!termsDoc.exists) {
        throw new Error("Payments Terms not found!");
      }
      return termsDoc.data().paymentTerms;
    }
    const paymentTerms = yield call(get);
    console.log({ paymentTerms });

    yield put(paymentTermsSuccess(paymentTerms));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetPaymentTerms() {
  yield takeLatest(GET_PAYMENT_TERMS, getPaymentTerms);
}
