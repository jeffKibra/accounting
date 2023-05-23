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

import { dbCollections } from '../../../utils/firebase';
import {
  GET_SALE_RECEIPT,
  GET_SALE_RECEIPTS,
  GET_CUSTOMER_SALE_RECEIPTS,
} from '../../actions/saleReceiptsActions';
import {
  start,
  saleReceiptSuccess,
  saleReceiptsSuccess,
  fail,
} from '../../slices/saleReceiptsSlice';
import { error as toastError } from '../../slices/toastSlice';

import { dateFromTimestamp } from '../../../utils/dates';

import { RootState, SaleReceipt } from '../../../types';

function formatReceiptDates(receipt: SaleReceipt) {
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

function* getSaleReceipt(action: PayloadAction<string>) {
  yield put(start(GET_SALE_RECEIPT));
  const saleReceiptId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  console.log({ saleReceiptId });

  async function get() {
    const salesCollection = dbCollections(orgId).saleReceipts;
    const receiptDoc = await getDoc(doc(salesCollection, saleReceiptId));
    const receiptData = receiptDoc.data();

    if (!receiptDoc.exists || !receiptData) {
      throw new Error('Sales Receipt not found!');
    }

    return {
      ...formatReceiptDates({
        ...receiptData,
        saleReceiptId: receiptDoc.id,
      }),
    };
  }

  try {
    const receipt: SaleReceipt = yield call(get);
    console.log({ receipt });

    yield put(saleReceiptSuccess(receipt));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetSaleReceipt() {
  yield takeLatest(GET_SALE_RECEIPT, getSaleReceipt);
}

function* getSaleReceipts() {
  yield put(start(GET_SALE_RECEIPTS));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    const salesCollection = dbCollections(orgId).saleReceipts;
    const q = query(
      salesCollection,
      orderBy('createdAt', 'desc'),
      where('status', '==', 0)
    );
    const snap = await getDocs(q);

    const saleReceipts = snap.docs.map(receiptDoc => {
      return {
        ...formatReceiptDates({
          ...receiptDoc.data(),
          saleReceiptId: receiptDoc.id,
        }),
      };
    });

    return saleReceipts;
  }

  try {
    const saleReceipts: SaleReceipt[] = yield call(get);

    yield put(saleReceiptsSuccess(saleReceipts));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetSaleReceipts() {
  yield takeLatest(GET_SALE_RECEIPTS, getSaleReceipts);
}

function* getCustomerSaleReceipts(action: PayloadAction<string>) {
  yield put(start(GET_CUSTOMER_SALE_RECEIPTS));
  const customerId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  // console.log({ customerId, statuses });
  async function get() {
    const salesCollection = dbCollections(orgId).saleReceipts;
    const q = query(
      salesCollection,
      orderBy('createdAt', 'desc'),
      where('customerId', '==', customerId),
      where('status', '==', 'active')
    );
    const snap = await getDocs(q);

    const saleReceipts = snap.docs.map(receiptDoc => {
      return {
        ...formatReceiptDates({
          ...receiptDoc.data(),
          saleReceiptId: receiptDoc.id,
        }),
      };
    });

    return saleReceipts;
  }

  try {
    const saleReceipts: SaleReceipt[] = yield call(get);
    // console.log({ saleReceipts });

    yield put(saleReceiptsSuccess(saleReceipts));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCustomerSaleReceipts() {
  yield takeLatest(GET_CUSTOMER_SALE_RECEIPTS, getCustomerSaleReceipts);
}
