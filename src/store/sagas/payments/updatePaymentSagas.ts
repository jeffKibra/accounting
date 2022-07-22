import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { updatePayment, fetchPaymentUpdateData } from "../../../utils/payments";
import { createDailySummary } from "../../../utils/summaries";

import { db } from "../../../utils/firebase";
import { UPDATE_PAYMENT } from "../../actions/paymentsActions";
import { start, success, fail } from "../../slices/paymentsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import {
  RootState,
  UserProfile,
  Account,
  PaymentReceivedForm,
} from "../../../types";

interface UpdateData extends PaymentReceivedForm {
  paymentId: string;
}

function* updatePaymentSaga(action: PayloadAction<UpdateData>) {
  yield put(start(UPDATE_PAYMENT));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const accounts: Account[] = yield select(
    (state: RootState) => state.accountsReducer.accounts
  );
  // console.log({ data, orgId, userProfile });

  const { paymentId, ...formData } = action.payload;

  async function update() {
    /**
     * create daily summary before proceeding
     */
    await createDailySummary(orgId);
    /**
     * use a transaction to update payment
     */
    await runTransaction(db, async (transaction) => {
      /**
       * fetch update data
       */
      const updateData = await fetchPaymentUpdateData(
        transaction,
        orgId,
        accounts,
        paymentId,
        formData
      );
      /**
       * update payment
       */
      updatePayment(
        transaction,
        orgId,
        userProfile,
        paymentId,
        formData,
        updateData,
        accounts
      );
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Payment sucessfully updated!"));
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
