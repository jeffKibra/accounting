import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { updateExpense } from "../../../utils/expenses";
import { createDailySummary } from "../../../utils/summaries";

import { UPDATE_EXPENSE } from "../../actions/expensesActions";
import { start, success, fail } from "../../slices/expenseSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* updateExpenseSaga({ data }) {
  yield put(start(UPDATE_EXPENSE));
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
      await updateExpense(transaction, orgId, userProfile, accounts, data);
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Expense Sucessfully Updated!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateExpense() {
  yield takeLatest(UPDATE_EXPENSE, updateExpenseSaga);
}
