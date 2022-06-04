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
  GET_INVOICE,
  GET_INVOICES,
  GET_CUSTOMER_INVOICES,
  GET_UNPAID_CUSTOMER_INVOICES,
  GET_PAYMENT_INVOICES_TO_EDIT,
} from "../../actions/invoicesActions";
import {
  start,
  invoiceSuccess,
  invoicesSuccess,
  fail,
} from "../../slices/invoicesSlice";
import { error as toastError } from "../../slices/toastSlice";

import { dateFromTimestamp } from "../../../utils/datesFunctions";

function formatInvoiceDates(invoice) {
  const { invoiceDate, dueDate, createdAt, modifiedAt } = invoice;

  return {
    ...invoice,
    invoiceDate: dateFromTimestamp(invoiceDate),
    dueDate: dateFromTimestamp(dueDate),
    createdAt: dateFromTimestamp(createdAt),
    modifiedAt: dateFromTimestamp(modifiedAt),
  };
}

const allStatuses = [
  "pending",
  "active",
  "partially paid",
  "paid",
  "draft",
  "sent",
];

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
      ...formatInvoiceDates(invoiceDoc.data()),
      invoiceId: invoiceDoc.id,
    };
  }

  try {
    const invoice = yield call(get);

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
        ...formatInvoiceDates(invoiceDoc.data()),
        invoiceId: invoiceDoc.id,
      });
    });

    return invoices;
  }

  try {
    const invoices = yield call(get);

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
  // console.log({ customerId, statuses });
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
        ...formatInvoiceDates(invoiceDoc.data()),
        invoiceId: invoiceDoc.id,
      });
    });

    return invoices;
  }

  try {
    const invoices = yield call(get);
    // console.log({ invoices });

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

function* getUnpaidCustomerInvoices({ type, customerId }) {
  yield put(start(type));

  const orgId = yield select((state) => state.orgsReducer.org.id);
  // console.log({ customerId, statuses });
  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "invoices"),
      // orderBy("createdAt", "asc"),
      where("customerId", "==", customerId),
      where("status", "==", "active"),
      where("balance", ">", 0)
    );

    const invoices = [];
    const snap = await getDocs(q);

    snap.forEach((invoiceDoc) => {
      invoices.push({
        ...formatInvoiceDates(invoiceDoc.data()),
        invoiceId: invoiceDoc.id,
      });
    });
    /**
     * sort by date
     */
    invoices.sort((invoice1, invoice2) => {
      console.log({ invoice1, invoice2 });
      const {
        createdAt: { seconds: seconds1 },
      } = invoice1;
      const {
        createdAt: { seconds: seconds2 },
      } = invoice2;

      return seconds1 - seconds2;
    });

    return invoices;
  }

  try {
    const invoices = yield call(get);
    // console.log({ invoices });

    yield put(invoicesSuccess(invoices));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetUnpaidCustomerInvoices() {
  yield takeLatest(GET_UNPAID_CUSTOMER_INVOICES, getUnpaidCustomerInvoices);
}

function* getPaymentInvoicesToEdit({ type, paymentId, customerId }) {
  yield put(start(type));
  console.log("fetching invoices to edit");
  const orgId = yield select((state) => state.orgsReducer.org.id);
  // console.log({ customerId, statuses });
  async function get() {
    //paid invoices to edit
    const q1 = query(
      collection(db, "organizations", orgId, "invoices"),
      orderBy("createdAt", "asc"),
      where("paymentsIds", "array-contains", paymentId),
      where("status", "==", "active"),
      where("balance", "==", 0)
    );
    //unpaid customer invoices
    const q2 = query(
      collection(db, "organizations", orgId, "invoices"),
      // orderBy("createdAt", "asc"),
      where("customerId", "==", customerId),
      where("status", "==", "active"),
      where("balance", ">", 0)
    );

    const invoices1 = [];
    const invoices2 = [];
    const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

    snap1.forEach((invoiceDoc) => {
      invoices1.push({
        ...formatInvoiceDates(invoiceDoc.data()),
        invoiceId: invoiceDoc.id,
      });
    });
    snap2.forEach((invoiceDoc) => {
      invoices2.push({
        ...formatInvoiceDates(invoiceDoc.data()),
        invoiceId: invoiceDoc.id,
      });
    });
    /**
     * sort by date
     */
    invoices2.sort((invoice1, invoice2) => {
      console.log({ invoice1, invoice2 });
      const {
        createdAt: { seconds: seconds1 },
      } = invoice1;
      const {
        createdAt: { seconds: seconds2 },
      } = invoice2;

      return seconds1 - seconds2;
    });

    return [...invoices1, ...invoices2];
  }

  try {
    const invoices = yield call(get);
    // console.log({ invoices });

    yield put(invoicesSuccess(invoices));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetPaymentInvoicesToEdit() {
  yield takeLatest(GET_PAYMENT_INVOICES_TO_EDIT, getPaymentInvoicesToEdit);
}
