import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";
import { updateExpense } from "../../../utils/expenses";
import { createDailySummary } from "../../../utils/summaries";

import { UPDATE_EXPENSE } from "../../actions/expensesActions";
import { start, success, fail } from "../../slices/expenseSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import {
  ExpenseFormData,
  RootState,
  UserProfile,
  Account,
} from "../../../types";

interface updateData extends ExpenseFormData {
  expenseId: string;
}

function* updateExpenseSaga(action: PayloadAction<updateData>) {
  yield put(start(UPDATE_EXPENSE));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const accounts: Account[] = yield select(
    (state: RootState) => state.accountsReducer.accounts
  );

  async function update() {
    /**
     * itialize by creating the daily summary if none is available
     */
    await createDailySummary(orgId);
    /**
     * update SalesReceipt using a transaction
     */
    console.log({ pay: action.payload });
    await runTransaction(db, async (transaction) => {
      await updateExpense(
        transaction,
        orgId,
        userProfile,
        accounts,
        action.payload
      );
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Expense Sucessfully Updated!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateExpense() {
  yield takeLatest(UPDATE_EXPENSE, updateExpenseSaga);
}
