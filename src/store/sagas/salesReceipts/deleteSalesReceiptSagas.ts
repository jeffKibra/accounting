import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";
import { deleteSalesReceipt } from "../../../utils/salesReceipts";
import { createDailySummary } from "../../../utils/summaries";

import { DELETE_SALES_RECEIPT } from "../../actions/salesReceiptsActions";
import { start, success, fail } from "../../slices/salesReceiptsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import { RootState, UserProfile } from "../../../types";

function* deleteSalesReceiptSaga(action: PayloadAction<string>) {
  yield put(start(DELETE_SALES_RECEIPT));
  const salesReceiptId = action.payload;
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
     * delete salesReceipt using a firestore transaction
     */
    await runTransaction(db, async (transaction) => {
      await deleteSalesReceipt(transaction, orgId, userProfile, salesReceiptId);
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Sales Receipt Sucessfully DELETED!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteSalesReceipt() {
  yield takeLatest(DELETE_SALES_RECEIPT, deleteSalesReceiptSaga);
}
