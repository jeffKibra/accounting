import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { deletePayment } from "../../../utils/payments";
import { createDailySummary } from "../../../utils/summaries";

import { DELETE_PAYMENT } from "../../actions/paymentsActions";
import { start, success, fail } from "../../slices/paymentsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* deletePaymentSaga({ paymentId }) {
  yield put(start(DELETE_PAYMENT));

  try {
    const org = yield select((state) => state.orgsReducer.org);
    const orgId = org.id;
    const userProfile = yield select((state) => state.authReducer.userProfile);

    async function update() {
      /**
       * initialize by creating daily summary if none is available
       */
      await createDailySummary(orgId);
      /**
       * delete payment using a transaction
       */
      await runTransaction(db, async (transaction) => {
        await deletePayment(transaction, orgId, userProfile, paymentId);
      });
    }

    yield call(update);

    yield put(success());
    yield put(toastSuccess("Payment sucessfully deleted!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeletePayment() {
  yield takeLatest(DELETE_PAYMENT, deletePaymentSaga);
}
