import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  getDoc,
  getDocs,
  collection,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import {
  GET_EXPENSE,
  GET_EXPENSES,
  GET_VENDOR_EXPENSES,
} from "../../actions/expensesActions";
import {
  start,
  expenseSuccess,
  expensesSuccess,
  fail,
} from "../../slices/expenseSlice";
import { error as toastError } from "../../slices/toastSlice";

import { dateFromTimestamp } from "../../../utils/dates";

function formatExpenseDates(expense) {
  const { expenseDate, createdAt, modifiedAt } = expense;

  return {
    ...expense,
    expenseDate: dateFromTimestamp(expenseDate),
    createdAt: dateFromTimestamp(createdAt),
    modifiedAt: dateFromTimestamp(modifiedAt),
  };
}

// function sortByDate(data1, data2) {
//   console.log({ data1, data2 });
//   const {
//     createdAt: { seconds: seconds1 },
//   } = data1;
//   const {
//     createdAt: { seconds: seconds2 },
//   } = data2;

//   return seconds1 - seconds2;
// }

function* getExpense({ expenseId }) {
  yield put(start(GET_EXPENSE));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  console.log({ expenseId });

  async function get() {
    const expenseDoc = await getDoc(
      doc(db, "organizations", orgId, "expenses", expenseId)
    );
    if (!expenseDoc.exists) {
      throw new Error("Expense not found!");
    }

    return {
      ...formatExpenseDates(expenseDoc.data()),
      expenseId: expenseDoc.id,
    };
  }

  try {
    const expense = yield call(get);
    console.log({ expense });

    yield put(expenseSuccess(expense));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetExpense() {
  yield takeLatest(GET_EXPENSE, getExpense);
}

function* getExpenses() {
  yield put(start(GET_EXPENSES));
  const orgId = yield select((state) => state.orgsReducer.org.id);

  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "expenses"),
      orderBy("createdAt", "desc"),
      where("status", "==", "active")
    );
    const expenses = [];
    const snap = await getDocs(q);

    snap.forEach((expenseDoc) => {
      expenses.push({
        ...formatExpenseDates(expenseDoc.data()),
        expenseId: expenseDoc.id,
      });
    });

    return expenses;
  }

  try {
    const expenses = yield call(get);

    yield put(expensesSuccess(expenses));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetExpenses() {
  yield takeLatest(GET_EXPENSES, getExpenses);
}

function* getVendorExpenses({ vendorId }) {
  yield put(start(GET_VENDOR_EXPENSES));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  // console.log({ vendorId, statuses });
  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "expenses"),
      orderBy("createdAt", "desc"),
      where("vendor.vendorId", "==", vendorId),
      where("status", "==", "active")
    );
    const expenses = [];
    const snap = await getDocs(q);

    snap.forEach((expenseDoc) => {
      expenses.push({
        ...formatExpenseDates(expenseDoc.data()),
        expenseId: expenseDoc.id,
      });
    });

    return expenses;
  }

  try {
    const expenses = yield call(get);
    // console.log({ expenses });

    yield put(expensesSuccess(expenses));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetVendorExpenses() {
  yield takeLatest(GET_VENDOR_EXPENSES, getVendorExpenses);
}
