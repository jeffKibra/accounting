import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { createPayment } from "../../../utils/payments";
import { createDailySummary } from "../../../utils/summaries";

import { CREATE_PAYMENT } from "../../actions/paymentsActions";
import { start, success, fail } from "../../slices/paymentsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* createPaymentSaga({ data }) {
  yield put(start(CREATE_PAYMENT));

  try {
    const org = yield select((state) => state.orgsReducer.org);
    const orgId = org.id;
    const userProfile = yield select((state) => state.authReducer.userProfile);
    const accounts = yield select((state) => state.accountsReducer.accounts);

    async function create() {
      /**
       * create daily summary before proceeding
       */
      await createDailySummary(orgId);
      /**
       * create payment using a firestore transaction
       */
      await runTransaction(db, async (transaction) => {
        await createPayment(transaction, org, userProfile, accounts, data);
      });
    }

    yield call(create);

    yield put(success());
    yield put(toastSuccess("Payment sucessfully created!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreatePayment() {
  yield takeLatest(CREATE_PAYMENT, createPaymentSaga);
}
