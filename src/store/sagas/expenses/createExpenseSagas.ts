import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction, collection, doc } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";
import { createExpense } from "../../../utils/expenses";
import { createDailySummary } from "../../../utils/summaries";

import { CREATE_EXPENSE } from "../../actions/expensesActions";
import { start, success, fail } from "../../slices/expenseSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

import {
  RootState,
  ExpenseFormData,
  UserProfile,
  Org,
  Account,
} from "../../../types";

function* createExpenseSaga(action: PayloadAction<ExpenseFormData>) {
  yield put(start(CREATE_EXPENSE));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const accounts: Account[] = yield select(
    (state: RootState) => state.accountsReducer.accounts
  );
  // console.log({ data });

  async function create() {
    /**
     * create daily summary before proceeding
     */
    await createDailySummary(orgId);
    /**
     * create expense using a firestore transaction
     */
    await runTransaction(db, async (transaction) => {
      /**
       * generate the expense slug
       */
      const expenseId = doc(
        collection(db, "organizations", orgId, "expenses")
      ).id;
      /**
       * create expense
       */
      await createExpense(
        transaction,
        org,
        userProfile,
        accounts,
        expenseId,
        action.payload
      );
    });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess("Expense created Sucessfully!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateExpense() {
  yield takeLatest(CREATE_EXPENSE, createExpenseSaga);
}
