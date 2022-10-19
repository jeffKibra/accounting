import { put, call, select, takeLatest } from 'redux-saga/effects';
import {
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';

import { db, dbCollections } from '../../../utils/firebase';
import {
  GET_EXPENSE,
  GET_EXPENSES,
  GET_VENDOR_EXPENSES,
} from '../../actions/expensesActions';
import {
  start,
  expenseSuccess,
  expensesSuccess,
  fail,
} from '../../slices/expenseSlice';
import { error as toastError } from '../../slices/toastSlice';

import { dateFromTimestamp } from '../../../utils/dates';

import { RootState, Expense } from '../../../types';

function formatExpenseDates(expense: Expense) {
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

function* getExpense(action: PayloadAction<string>) {
  yield put(start(GET_EXPENSE));
  const expenseId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  console.log({ expenseId });

  async function get() {
    const expenseDoc = await getDoc(
      doc(db, 'organizations', orgId, 'expenses', expenseId)
    );
    if (!expenseDoc.exists) {
      throw new Error('Expense not found!');
    }

    const expense = expenseDoc.data() as Expense;

    return {
      ...formatExpenseDates(expense),
      expenseId: expenseDoc.id,
    };
  }

  try {
    const expense: Expense = yield call(get);
    console.log({ expense });

    yield put(expenseSuccess(expense));
  } catch (err) {
    const error = err as Error;
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
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    const expensesCollection = dbCollections(orgId).expenses;
    const q = query(
      expensesCollection,
      orderBy('createdAt', 'desc'),
      where('status', '==', 0)
    );
    const snap = await getDocs(q);
    const expenses = snap.docs.map(expenseDoc => {
      const expenseData = expenseDoc.data();
      return {
        ...formatExpenseDates({
          ...expenseData,
          expenseId: expenseDoc.id,
        }),
      };
    });

    return expenses;
  }

  try {
    const expenses: Expense[] = yield call(get);

    yield put(expensesSuccess(expenses));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetExpenses() {
  yield takeLatest(GET_EXPENSES, getExpenses);
}

function* getVendorExpenses(action: PayloadAction<string>) {
  yield put(start(GET_VENDOR_EXPENSES));
  const vendorId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  // console.log({ vendorId, statuses });
  async function get() {
    const expensesCollection = dbCollections(orgId).expenses;
    const q = query(
      expensesCollection,
      orderBy('createdAt', 'desc'),
      where('vendor.vendorId', '==', vendorId),
      where('status', '==', 'active')
    );
    const snap = await getDocs(q);
    const expenses = snap.docs.map(expenseDoc => {
      return {
        ...formatExpenseDates({
          ...expenseDoc.data(),
          expenseId: expenseDoc.id,
        }),
      };
    });

    return expenses;
  }

  try {
    const expenses: Expense[] = yield call(get);
    // console.log({ expenses });

    yield put(expensesSuccess(expenses));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetVendorExpenses() {
  yield takeLatest(GET_VENDOR_EXPENSES, getVendorExpenses);
}
