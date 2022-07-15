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
  GET_PAYMENT,
  GET_PAYMENTS,
  GET_CUSTOMER_PAYMENTS,
} from "../../actions/paymentsActions";
import {
  start,
  paymentSuccess,
  paymentsSuccess,
  fail,
} from "../../slices/paymentsSlice";
import { error as toastError } from "../../slices/toastSlice";

import { dateFromTimestamp } from "../../../utils/dates";

import { RootState, PaymentReceived, InvoiceSummary } from "../../../types";

function formatPaymentDates(payment: PaymentReceived) {
  const { paymentDate, createdAt, modifiedAt, paidInvoices } = payment;

  return {
    ...payment,
    paymentDate: dateFromTimestamp(paymentDate),
    createdAt: dateFromTimestamp(createdAt),
    modifiedAt: dateFromTimestamp(modifiedAt),
    paidInvoices: paidInvoices.map((invoice: InvoiceSummary) => {
      const { invoiceDate, dueDate } = invoice;
      return {
        ...invoice,
        invoiceDate: dateFromTimestamp(invoiceDate),
        dueDate: dateFromTimestamp(dueDate),
      };
    }),
  };
}

function* getPayment(action: PayloadAction<string>) {
  yield put(start(GET_PAYMENT));
  const paymentId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    const paymentsCollection = dbCollections(orgId).paymentsReceived;
    const paymentDoc = await getDoc(doc(paymentsCollection, paymentId));
    const paymentReceived = paymentDoc.data();
    if (!paymentDoc.exists || !paymentReceived) {
      throw new Error("payment not found!");
    }

    return {
      ...formatPaymentDates({ ...paymentReceived, paymentId: paymentDoc.id }),
    };
  }

  try {
    const payment: PaymentReceived = yield call(get);

    yield put(paymentSuccess(payment));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetPayment() {
  yield takeLatest(GET_PAYMENT, getPayment);
}

function* getPayments() {
  yield put(start(GET_PAYMENTS));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    const paymentsCollection = dbCollections(orgId).paymentsReceived;
    const q = query(
      paymentsCollection,
      orderBy("createdAt", "desc"),
      where("status", "==", "active")
    );
    const snap = await getDocs(q);
    const payments = snap.docs.map((paymentDoc) => {
      return {
        ...formatPaymentDates({
          ...paymentDoc.data(),
          paymentId: paymentDoc.id,
        }),
      };
    });

    return payments;
  }

  try {
    const payments: PaymentReceived[] = yield call(get);

    yield put(paymentsSuccess(payments));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetPayments() {
  yield takeLatest(GET_PAYMENTS, getPayments);
}

function* getCustomerPayments(action: PayloadAction<string>) {
  yield put(start(GET_CUSTOMER_PAYMENTS));
  const customerId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  // console.log({ customerId });
  async function get() {
    const paymentsCollection = dbCollections(orgId).paymentsReceived;
    const q = query(
      paymentsCollection,
      orderBy("createdAt", "asc"),
      where("customerId", "==", customerId),
      where("status", "==", "active")
    );
    const snap = await getDocs(q);

    const payments = snap.docs.map((paymentDoc) => {
      return {
        ...formatPaymentDates({
          ...paymentDoc.data(),
          paymentId: paymentDoc.id,
        }),
      };
    });

    return payments;
  }

  try {
    const payments: PaymentReceived[] = yield call(get);

    yield put(paymentsSuccess(payments));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCustomerPayments() {
  yield takeLatest(GET_CUSTOMER_PAYMENTS, getCustomerPayments);
}
