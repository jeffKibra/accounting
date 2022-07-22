import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { dbCollections } from "../../../utils/firebase";
import {
  GET_SALES_RECEIPT,
  GET_SALES_RECEIPTS,
  GET_CUSTOMER_SALES_RECEIPTS,
} from "../../actions/salesReceiptsActions";
import {
  start,
  salesReceiptSuccess,
  salesReceiptsSuccess,
  fail,
} from "../../slices/salesReceiptsSlice";
import { error as toastError } from "../../slices/toastSlice";

import { dateFromTimestamp } from "../../../utils/dates";

import { RootState, SalesReceipt } from "../../../types";

function formatReceiptDates(receipt: SalesReceipt) {
  const { receiptDate, createdAt, modifiedAt } = receipt;

  return {
    ...receipt,
    receiptDate: dateFromTimestamp(receiptDate),
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

function* getSalesReceipt(action: PayloadAction<string>) {
  yield put(start(GET_SALES_RECEIPT));
  const salesReceiptId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  console.log({ salesReceiptId });

  async function get() {
    const salesCollection = dbCollections(orgId).salesReceipts;
    const receiptDoc = await getDoc(doc(salesCollection, salesReceiptId));
    const receiptData = receiptDoc.data();

    if (!receiptDoc.exists || !receiptData) {
      throw new Error("Sales Receipt not found!");
    }

    return {
      ...formatReceiptDates({
        ...receiptData,
        salesReceiptId: receiptDoc.id,
      }),
    };
  }

  try {
    const receipt: SalesReceipt = yield call(get);
    console.log({ receipt });

    yield put(salesReceiptSuccess(receipt));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetSalesReceipt() {
  yield takeLatest(GET_SALES_RECEIPT, getSalesReceipt);
}

function* getSalesReceipts() {
  yield put(start(GET_SALES_RECEIPTS));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    const salesCollection = dbCollections(orgId).salesReceipts;
    const q = query(
      salesCollection,
      orderBy("createdAt", "desc"),
      where("status", "==", "active")
    );
    const snap = await getDocs(q);

    const salesReceipts = snap.docs.map((receiptDoc) => {
      return {
        ...formatReceiptDates({
          ...receiptDoc.data(),
          salesReceiptId: receiptDoc.id,
        }),
      };
    });

    return salesReceipts;
  }

  try {
    const salesReceipts: SalesReceipt[] = yield call(get);

    yield put(salesReceiptsSuccess(salesReceipts));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetSalesReceipts() {
  yield takeLatest(GET_SALES_RECEIPTS, getSalesReceipts);
}

function* getCustomerSalesReceipts(action: PayloadAction<string>) {
  yield put(start(GET_CUSTOMER_SALES_RECEIPTS));
  const customerId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  // console.log({ customerId, statuses });
  async function get() {
    const salesCollection = dbCollections(orgId).salesReceipts;
    const q = query(
      salesCollection,
      orderBy("createdAt", "desc"),
      where("customerId", "==", customerId),
      where("status", "==", "active")
    );
    const snap = await getDocs(q);

    const salesReceipts = snap.docs.map((receiptDoc) => {
      return {
        ...formatReceiptDates({
          ...receiptDoc.data(),
          salesReceiptId: receiptDoc.id,
        }),
      };
    });

    return salesReceipts;
  }

  try {
    const salesReceipts: SalesReceipt[] = yield call(get);
    // console.log({ salesReceipts });

    yield put(salesReceiptsSuccess(salesReceipts));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCustomerSalesReceipts() {
  yield takeLatest(GET_CUSTOMER_SALES_RECEIPTS, getCustomerSalesReceipts);
}
