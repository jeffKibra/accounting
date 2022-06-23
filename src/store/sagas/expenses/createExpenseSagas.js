import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { createExpense, createExpenseId } from "../../../utils/expenses";
import { createDailySummary } from "../../../utils/summaries";

import { CREATE_EXPENSE } from "../../actions/expensesActions";
import { start, success, fail } from "../../slices/expenseSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* createExpenseSaga({ data }) {
  yield put(start(CREATE_EXPENSE));
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
     * create expense using a firestore transaction
     */
    await runTransaction(db, async (transaction) => {
      /**
       * generate the expense slug
       */
      const expenseId = await createExpenseId(transaction, orgId);
      /**
       * create expense
       */
      await createExpense(
        transaction,
        org,
        userProfile,
        accounts,
        expenseId,
        data
      );
    });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess("Expense created Sucessfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateExpense() {
  yield takeLatest(CREATE_EXPENSE, createExpenseSaga);
}
