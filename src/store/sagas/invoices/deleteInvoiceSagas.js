import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import {
  deleteInvoiceFetch,
  deleteInvoiceWrite,
} from "../../../utils/invoices";
import { createDailySummary } from "../../../utils/summaries";

import { DELETE_INVOICE } from "../../actions/invoicesActions";
import { start, success, fail } from "../../slices/invoicesSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* deleteInvoiceSaga({ invoiceId }) {
  yield put(start(DELETE_INVOICE));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);

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
      const { groupedEntries, invoice } = await deleteInvoiceFetch(
        transaction,
        orgId,
        invoiceId
      );
      /**
       * last part of deleting
       * delete relevant data
       */
      deleteInvoiceWrite(
        transaction,
        orgId,
        userProfile,
        invoice,
        groupedEntries
      );
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Invoice Sucessfully Deleted!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteInvoice() {
  yield takeLatest(DELETE_INVOICE, deleteInvoiceSaga);
}
