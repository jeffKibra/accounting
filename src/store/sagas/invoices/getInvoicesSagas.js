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
  GET_INVOICE,
  GET_INVOICES,
  GET_CUSTOMER_INVOICES,
} from "../../actions/invoicesActions";
import {
  start,
  invoiceSuccess,
  invoicesSuccess,
  fail,
} from "../../slices/invoicesSlice";
import { error as toastError } from "../../slices/toastSlice";

const allStatuses = [
  "pending",
  "active",
  "partially paid",
  "paid",
  "draft",
  "sent",
];

export async function getLatestInvoice(orgId) {
  console.log({ orgId });
  const q = query(
    collection(db, "organizations", orgId, "invoices"),
    orderBy("createdAt", "desc"),
    where("status", "in", allStatuses),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    return null;
  }

  const invoiceDoc = snap.docs[0];
  return {
    ...invoiceDoc.data(),
    invoiceId: invoiceDoc.id,
  };
}

function* getInvoice({ invoiceId }) {
  yield put(start(GET_INVOICE));
  const orgId = yield select((state) => state.orgsReducer.org.id);

  async function get() {
    const invoiceDoc = await getDoc(
      doc(db, "organizations", orgId, "invoices", invoiceId)
    );
    if (!invoiceDoc.exists) {
      throw new Error("Invoice not found!");
    }

    return {
      ...invoiceDoc.data(),
      invoiceId: invoiceDoc.id,
    };
  }

  try {
    const invoice = yield call(get);
    console.log({ invoice });

    yield put(invoiceSuccess(invoice));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetInvoice() {
  yield takeLatest(GET_INVOICE, getInvoice);
}

function* getInvoices({ statuses }) {
  yield put(start(GET_INVOICES));
  const orgId = yield select((state) => state.orgsReducer.org.id);

  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "invoices"),
      orderBy("createdAt", "desc"),
      where("status", "in", statuses || allStatuses)
    );
    const invoices = [];
    const snap = await getDocs(q);

    snap.forEach((invoiceDoc) => {
      invoices.push({
        ...invoiceDoc.data(),
        invoiceId: invoiceDoc.id,
      });
    });

    return invoices;
  }

  try {
    const invoices = yield call(get);
    console.log({ invoices });

    yield put(invoicesSuccess(invoices));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetInvoices() {
  yield takeLatest(GET_INVOICES, getInvoices);
}

function* getCustomerInvoices({ customerId, statuses }) {
  yield put(start(GET_CUSTOMER_INVOICES));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  console.log({ customerId, statuses });
  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "invoices"),
      orderBy("createdAt", "asc"),
      where("customerId", "==", customerId),
      where("status", "in", statuses || allStatuses)
    );
    const invoices = [];
    const snap = await getDocs(q);

    snap.forEach((invoiceDoc) => {
      invoices.push({
        ...invoiceDoc.data(),
        invoiceId: invoiceDoc.id,
      });
    });

    return invoices;
  }

  try {
    const invoices = yield call(get);
    console.log({ invoices });

    yield put(invoicesSuccess(invoices));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCustomerInvoices() {
  yield takeLatest(GET_CUSTOMER_INVOICES, getCustomerInvoices);
}
