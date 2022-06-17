import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import {
  createSalesReceipt,
  createReceiptSlug,
} from "../../../utils/salesReceipts";
import { createDailySummary } from "../../../utils/summaries";

import { CREATE_SALES_RECEIPT } from "../../actions/salesReceiptsActions";
import { start, success, fail } from "../../slices/salesReceiptsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* createSalesReceiptSaga({ data }) {
  yield put(start(CREATE_SALES_RECEIPT));
  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const accounts = yield select((state) => state.accountsReducer.accounts);
  // console.log({ data });

  async function create() {
    /**
     * create daily summary before proceeding
     */
    await createDailySummary(orgId);
    /**
     * create salesReceipt using a firestore transaction
     */
    await runTransaction(db, async (transaction) => {
      /**
       * generate the salesReceipt slug
       */
      const salesReceiptSlug = await createReceiptSlug(transaction, orgId);
      /**
       * create salesReceipt
       */
      await createSalesReceipt(
        transaction,
        org,
        userProfile,
        accounts,
        salesReceiptSlug,
        data
      );
    });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess("Sales Receipt created Sucessfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateSalesReceipt() {
  yield takeLatest(CREATE_SALES_RECEIPT, createSalesReceiptSaga);
}
