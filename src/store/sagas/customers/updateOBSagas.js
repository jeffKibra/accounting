import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { createDailySummary } from "../../../utils/summaries";
import { updateOpeningBalance } from "../../../utils/customers";

import { UPDATE_OPENING_BALANCE } from "../../actions/customersActions";
import { start, success, fail } from "../../slices/customersSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

function* updateOpeningBalanceSaga({ data }) {
  yield put(start(UPDATE_OPENING_BALANCE));
  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const accounts = yield select((state) => state.accountsReducer.accounts);

  // console.log({ data });

  async function update() {
    /**
     * create daily summary data
     */
    await createDailySummary(orgId);
    /**
     * update opening balance using a transaction
     */
    await runTransaction(db, async (transaction) => {
      await updateOpeningBalance(transaction, org, userProfile, accounts, data);
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Action successful!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateCustomerOpeningBalance() {
  yield takeLatest(UPDATE_OPENING_BALANCE, updateOpeningBalanceSaga);
}
