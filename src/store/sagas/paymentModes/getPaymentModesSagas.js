import { call, takeLatest, select, put } from "redux-saga/effects";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { GET_PAYMENT_MODES } from "../../actions/paymentModesActions";
import {
  start,
  fail,
  paymentModesSuccess,
} from "../../slices/paymentModesSlice";
import { error as toastError } from "../../slices/toastSlice";

function* getPaymentModes({ type }) {
  try {
    yield put(start(type));
    const orgId = yield select((state) => state.orgsReducer.org?.id);

    async function get() {
      const modesDoc = await getDoc(
        doc(db, "organizations", orgId, "orgDetails", "paymentModes")
      );
      if (!modesDoc.exists) {
        throw new Error("Payments modes not found!");
      }
      const modesData = modesDoc.data();
      return Object.keys(modesData).map((key) => {
        return {
          ...modesData[key],
        };
      });
    }
    const paymentModes = yield call(get);
    // console.log({ paymentModes });

    yield put(paymentModesSuccess(paymentModes));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetPaymentModes() {
  yield takeLatest(GET_PAYMENT_MODES, getPaymentModes);
}
