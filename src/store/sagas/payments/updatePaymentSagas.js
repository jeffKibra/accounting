import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";

import { updatePayment } from "../../../utils/payments";
import { createDailySummary } from "../../../utils/summaries";

import { db } from "../../../utils/firebase";
import { UPDATE_PAYMENT } from "../../actions/paymentsActions";
import { start, success, fail } from "../../slices/paymentsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* updatePaymentSaga({ data }) {
  yield put(start(UPDATE_PAYMENT));

  try {
    const org = yield select((state) => state.orgsReducer.org);
    const orgId = org.id;
    const userProfile = yield select((state) => state.authReducer.userProfile);
    const accounts = yield select((state) => state.accountsReducer.accounts);
    // console.log({ data, orgId, userProfile });

    async function update() {
      await createDailySummary(orgId);

      await runTransaction(db, async (transaction) => {
        await updatePayment(transaction, orgId, userProfile, accounts, data);
      });
    }

    yield call(update);

    yield put(success());
    yield put(toastSuccess("Payment sucessfully updated!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdatePayment() {
  yield takeLatest(UPDATE_PAYMENT, updatePaymentSaga);
}
