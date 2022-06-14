import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { createInvoice, createInvoiceSlug } from "../../../utils/invoices";
import { createDailySummary } from "../../../utils/summaries";

import { CREATE_INVOICE } from "../../actions/invoicesActions";
import { start, success, fail } from "../../slices/invoicesSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* createInvoiceSaga({ data }) {
  yield put(start(CREATE_INVOICE));
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
     * create invoice using a firestore transaction
     */
    await runTransaction(db, async (transaction) => {
      /**
       * generate the invoice slug
       */
      const invoiceSlug = await createInvoiceSlug(transaction, orgId);
      /**
       * create invoice
       */
      await createInvoice(
        transaction,
        org,
        userProfile,
        accounts,
        invoiceSlug,
        data
      );
    });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess("Invoice created Sucessfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateInvoice() {
  yield takeLatest(CREATE_INVOICE, createInvoiceSaga);
}
