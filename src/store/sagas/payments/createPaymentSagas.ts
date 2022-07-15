import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";
import { createPayment } from "../../../utils/payments";
import { createDailySummary } from "../../../utils/summaries";

import { CREATE_PAYMENT } from "../../actions/paymentsActions";
import { start, success, fail } from "../../slices/paymentsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import {
  UserProfile,
  Account,
  Org,
  PaymentReceivedForm,
  RootState,
} from "../../../types";

function* createPaymentSaga(action: PayloadAction<PaymentReceivedForm>) {
  yield put(start(CREATE_PAYMENT));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const accounts: Account[] = yield select(
    (state: RootState) => state.accountsReducer.accounts
  );

  async function create() {
    /**
     * create daily summary before proceeding
     */
    await createDailySummary(orgId);
    /**
     * create payment using a firestore transaction
     */
    await runTransaction(db, async (transaction) => {
      await createPayment(
        transaction,
        org,
        userProfile,
        accounts,
        action.payload
      );
    });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess("Payment sucessfully created!"));
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
