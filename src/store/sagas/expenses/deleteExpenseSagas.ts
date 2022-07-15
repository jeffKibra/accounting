import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";
import { deleteExpense } from "../../../utils/expenses";
import { createDailySummary } from "../../../utils/summaries";

import { DELETE_EXPENSE } from "../../actions/expensesActions";
import { start, success, fail } from "../../slices/expenseSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import { RootState, UserProfile } from "../../../types";

function* deleteExpenseSaga(action: PayloadAction<string>) {
  yield put(start(DELETE_EXPENSE));
  const expenseId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );

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
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteExpense() {
  yield takeLatest(DELETE_EXPENSE, deleteExpenseSaga);
}
