import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";
import { deletePayment } from "../../../utils/payments";
import { createDailySummary } from "../../../utils/summaries";

import { DELETE_PAYMENT } from "../../actions/paymentsActions";
import { start, success, fail } from "../../slices/paymentsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import { RootState, UserProfile } from "../../../types";

function* deletePaymentSaga(action: PayloadAction<string>) {
  yield put(start(DELETE_PAYMENT));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );

  async function update() {
    /**
     * initialize by creating daily summary if none is available
     */
    await createDailySummary(orgId);
    /**
     * delete payment using a transaction
     */
    await runTransaction(db, async (transaction) => {
      await deletePayment(transaction, orgId, userProfile, action.payload);
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Payment sucessfully deleted!"));
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
