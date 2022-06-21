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

function formatReceiptDates(receipt) {
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

function* getSalesReceipt({ salesReceiptId }) {
  yield put(start(GET_SALES_RECEIPT));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  console.log({ salesReceiptId });

  async function get() {
    const receiptDoc = await getDoc(
      doc(db, "organizations", orgId, "salesReceipts", salesReceiptId)
    );
    if (!receiptDoc.exists) {
      throw new Error("Sales Receipt not found!");
    }

    return {
      ...formatReceiptDates(receiptDoc.data()),
      salesReceiptId: receiptDoc.id,
    };
  }

  try {
    const receipt = yield call(get);
    console.log({ receipt });

    yield put(salesReceiptSuccess(receipt));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetSalesReceipt() {
  yield takeLatest(GET_SALES_RECEIPT, getSalesReceipt);
}

function* getSalesReceipts({ statuses }) {
  yield put(start(GET_SALES_RECEIPTS));
  const orgId = yield select((state) => state.orgsReducer.org.id);

  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "salesReceipts"),
      orderBy("createdAt", "desc"),
      where("status", "==", "active")
    );
    const salesReceipts = [];
    const snap = await getDocs(q);

    snap.forEach((receiptDoc) => {
      salesReceipts.push({
        ...formatReceiptDates(receiptDoc.data()),
        salesReceiptId: receiptDoc.id,
      });
    });

    return salesReceipts;
  }

  try {
    const salesReceipts = yield call(get);

    yield put(salesReceiptsSuccess(salesReceipts));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetSalesReceipts() {
  yield takeLatest(GET_SALES_RECEIPTS, getSalesReceipts);
}

function* getCustomerSalesReceipts({ customerId }) {
  yield put(start(GET_CUSTOMER_SALES_RECEIPTS));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  // console.log({ customerId, statuses });
  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "salesReceipts"),
      orderBy("createdAt", "desc"),
      where("customerId", "==", customerId),
      where("status", "==", "active")
    );
    const salesReceipts = [];
    const snap = await getDocs(q);

    snap.forEach((receiptDoc) => {
      salesReceipts.push({
        ...formatReceiptDates(receiptDoc.data()),
        salesReceiptId: receiptDoc.id,
      });
    });

    return salesReceipts;
  }

  try {
    const salesReceipts = yield call(get);
    // console.log({ salesReceipts });

    yield put(salesReceiptsSuccess(salesReceipts));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCustomerSalesReceipts() {
  yield takeLatest(GET_CUSTOMER_SALES_RECEIPTS, getCustomerSalesReceipts);
}
