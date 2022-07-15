import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";
import { updateSalesReceipt } from "../../../utils/salesReceipts";
import { createDailySummary } from "../../../utils/summaries";

import { UPDATE_SALES_RECEIPT } from "../../actions/salesReceiptsActions";
import { start, success, fail } from "../../slices/salesReceiptsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import {
  RootState,
  UserProfile,
  Account,
  SalesReceiptForm,
} from "../../../types";

interface UpdateData extends SalesReceiptForm {
  salesReceiptId: string;
}

function* updateSalesReceiptSaga(action: PayloadAction<UpdateData>) {
  yield put(start(UPDATE_SALES_RECEIPT));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const accounts: Account[] = yield select(
    (state: RootState) => state.accountsReducer.accounts
  );

  async function update() {
    /**
     * itialize by creating the daily summary if none is available
     */
    await createDailySummary(orgId);
    /**
     * update SalesReceipt using a transaction
     */
    const { salesReceiptId, ...formData } = action.payload;
    await runTransaction(db, async (transaction) => {
      await updateSalesReceipt(
        transaction,
        orgId,
        userProfile,
        accounts,
        salesReceiptId,
        formData
      );
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Sales Receipt Sucessfully Updated!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateSalesReceipt() {
  yield takeLatest(UPDATE_SALES_RECEIPT, updateSalesReceiptSaga);
}
