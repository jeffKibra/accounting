import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { updateSalesReceipt } from "../../../utils/salesReceipts";
import { createDailySummary } from "../../../utils/summaries";

import { UPDATE_SALES_RECEIPT } from "../../actions/salesReceiptsActions";
import { start, success, fail } from "../../slices/salesReceiptsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* updateSalesReceiptSaga({ data }) {
  yield put(start(UPDATE_SALES_RECEIPT));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const accounts = yield select((state) => state.accountsReducer.accounts);

  async function update() {
    /**
     * itialize by creating the daily summary if none is available
     */
    await createDailySummary(orgId);
    /**
     * update SalesReceipt using a transaction
     */
    await runTransaction(db, async (transaction) => {
      await updateSalesReceipt(transaction, orgId, userProfile, accounts, data);
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Sales Receipt Sucessfully Updated!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateSalesReceipt() {
  yield takeLatest(UPDATE_SALES_RECEIPT, updateSalesReceiptSaga);
}
