import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";
import {
  fetchInvoiceDeletionData,
  deleteInvoice,
} from "../../../utils/invoices";
import { createDailySummary } from "../../../utils/summaries";

import { DELETE_INVOICE } from "../../actions/invoicesActions";
import { start, success, fail } from "../../slices/invoicesSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import { UserProfile, RootState } from "../../../types";

function* deleteInvoiceSaga(action: PayloadAction<string>) {
  yield put(start(DELETE_INVOICE));
  const invoiceId = action.payload;
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
     * delete invoice using a firestore transaction
     */
    await runTransaction(db, async (transaction) => {
      /**
       * first part of deleting
       * fetch relevant deletion data
       */
      const { groupedEntries, invoice } = await fetchInvoiceDeletionData(
        transaction,
        orgId,
        invoiceId
      );
      /**
       * last part of deleting
       * delete relevant data
       */
      deleteInvoice(transaction, orgId, userProfile, invoice, groupedEntries);
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Invoice Sucessfully Deleted!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteInvoice() {
  yield takeLatest(DELETE_INVOICE, deleteInvoiceSaga);
}
