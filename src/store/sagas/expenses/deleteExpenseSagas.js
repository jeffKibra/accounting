import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { deleteExpense } from "../../../utils/expenses";
import { createDailySummary } from "../../../utils/summaries";

import { DELETE_EXPENSE } from "../../actions/expensesActions";
import { start, success, fail } from "../../slices/expenseSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* deleteExpenseSaga({ expenseId }) {
  yield put(start(DELETE_EXPENSE));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);

  async function update() {
    /**
     * initialize by creating daily summary if none is available
     */
    await createDailySummary(orgId);
    /**
     * delete expense using a firestore transaction
     */
    await runTransaction(db, async (transaction) => {
      await deleteExpense(transaction, orgId, userProfile, expenseId);
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Expense Sucessfully DELETED!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteExpense() {
  yield takeLatest(DELETE_EXPENSE, deleteExpenseSaga);
}
