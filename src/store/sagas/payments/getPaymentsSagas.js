import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  getDoc,
  getDocs,
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
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

export async function getLatestPayment(orgId, customerId) {
  console.log({ orgId, customerId });
  const q = query(
    collection(db, "organizations", orgId, "payments"),
    orderBy("createdAt", "desc"),
    where("customerId", "==", customerId),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    return null;
  }

  const paymentDoc = snap.docs[0];
  return {
    ...paymentDoc.data(),
    paymentId: paymentDoc.id,
  };
}

function* getPayment({ paymentId }) {
  yield put(start(GET_PAYMENT));
  const orgId = yield select((state) => state.orgsReducer.org.id);

  async function get() {
    const paymentDoc = await getDoc(
      doc(db, "organizations", orgId, "payments", paymentId)
    );
    if (!paymentDoc.exists) {
      throw new Error("payment not found!");
    }

    return {
      ...paymentDoc.data(),
      paymentId: paymentDoc.id,
    };
  }

  try {
    const payment = yield call(get);
    console.log({ payment });

    yield put(paymentSuccess(payment));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetPayment() {
  yield takeLatest(GET_PAYMENT, getPayment);
}

function* getPayments({ statuses }) {
  yield put(start(GET_PAYMENTS));
  const orgId = yield select((state) => state.orgsReducer.org.id);

  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "payments"),
      orderBy("createdAt", "desc"),
      where("status", "in", statuses || ["pending", "paid", "draft", "sent"])
    );
    const payments = [];
    const snap = await getDocs(q);

    snap.forEach((paymentDoc) => {
      payments.push({
        ...paymentDoc.data(),
        paymentId: paymentDoc.id,
      });
    });

    return payments;
  }

  try {
    const payments = yield call(get);
    console.log({ payments });

    yield put(paymentsSuccess(payments));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetPayments() {
  yield takeLatest(GET_PAYMENTS, getPayments);
}

function* getCustomerPayments({ customerId, statuses }) {
  yield put(start(GET_CUSTOMER_PAYMENTS));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  console.log({ customerId, statuses });
  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "payments"),
      orderBy("createdAt", "asc"),
      where("customerId", "==", customerId),
      where("status", "in", statuses || ["pending", "paid", "draft", "sent"])
    );
    const payments = [];
    const snap = await getDocs(q);

    snap.forEach((paymentDoc) => {
      payments.push({
        ...paymentDoc.data(),
        paymentId: paymentDoc.id,
      });
    });

    return payments;
  }

  try {
    const payments = yield call(get);
    console.log({ payments });

    yield put(paymentsSuccess(payments));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCustomerPayments() {
  yield takeLatest(GET_CUSTOMER_PAYMENTS, getCustomerPayments);
}