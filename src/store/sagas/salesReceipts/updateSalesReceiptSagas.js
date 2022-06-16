import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { updateInvoice } from "../../../utils/invoices";
import { createDailySummary } from "../../../utils/summaries";

import { UPDATE_INVOICE } from "../../actions/invoicesActions";
import { start, success, fail } from "../../slices/invoicesSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* updateInvoiceSaga({ data }) {
  yield put(start(UPDATE_INVOICE));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const accounts = yield select((state) => state.accountsReducer.accounts);

  async function update() {
    /**
     * itialize by creating the daily summary if none is available
     */
    await createDailySummary(orgId);
    /**
     * update invoice using a transaction
     */
    await runTransaction(db, async (transaction) => {
      await updateInvoice(transaction, orgId, userProfile, accounts, data);
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Invoice updated Sucessfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateInvoice() {
  yield takeLatest(UPDATE_INVOICE, updateInvoiceSaga);
}
