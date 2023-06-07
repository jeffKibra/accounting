import { put, call, select, takeLatest } from 'redux-saga/effects';
import {
  getDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';

import { dbCollections } from '../../../utils/firebase';
import {
  GET_INVOICE,
  GET_INVOICES,
  GET_CUSTOMER_INVOICES,
  GET_CUSTOMER_UNPAID_INVOICES,
  GET_PAYMENT_INVOICES_TO_EDIT,
  GET_PAYMENT_INVOICES,
} from '../../actions/invoicesActions';
import {
  start,
  invoiceSuccess,
  invoicesSuccess,
  fail,
} from '../../slices/invoicesSlice';
import { error as toastError } from '../../slices/toastSlice';

import { dateFromTimestamp } from '../../../utils/dates';

import { Invoice, RootState } from '../../../types';

//----------------------------------------------------------------

interface InvoicesResponse {
  invoices: Invoice[];
  error: Error;
}

interface InvoiceResponse {
  invoice: Invoice;
  error: Error;
}

//----------------------------------------------------------------

function formatInvoiceDates(invoice: Invoice) {
  const { saleDate, dueDate, createdAt, modifiedAt } = invoice;

  return {
    ...invoice,
    saleDate: dateFromTimestamp(saleDate),
    dueDate: dateFromTimestamp(dueDate),
    createdAt: dateFromTimestamp(createdAt),
    modifiedAt: dateFromTimestamp(modifiedAt),
  };
}

function sortByDateAsc(inv1: unknown, inv2: unknown) {
  const invoice1 = inv1 as Invoice;
  const invoice2 = inv2 as Invoice;

  // console.log({ invoice1, invoice2 });
  const { createdAt: createdAt1 } = invoice1;
  const { createdAt: createdAt2 } = invoice2;

  if (createdAt1 instanceof Timestamp && createdAt2 instanceof Timestamp) {
    return createdAt1.seconds - createdAt2.seconds;
  } else {
    if (createdAt1 < createdAt2) {
      return -1;
    } else if (createdAt1 > createdAt2) {
      return 1;
    } else {
      return 0;
    }
  }
}

// function sortByDateDesc(invoice1, invoice2) {
// // console.log({ invoice1, invoice2 });
//   const { createdAt: createdAt1 } = invoice1;
//   const { createdAt: createdAt2 } = invoice2;

//   return createdAt2 - createdAt1;
// }

function* getInvoice(action: PayloadAction<string>) {
  yield put(start(GET_INVOICE));
  const invoiceId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    try {
      const invoicesCollection = dbCollections(orgId).invoices;
      const invoiceDoc = await getDoc(doc(invoicesCollection, invoiceId));
      const invoice = invoiceDoc.data();
      if (!invoiceDoc.exists || !invoice) {
        throw new Error('Invoice not found!');
      }

      return {
        invoice: formatInvoiceDates({ ...invoice, invoiceId: invoiceDoc.id }),
      };
    } catch (error) {
      return { error };
    }
  }

  try {
    const response: InvoiceResponse = yield call(get);
    const { error, invoice } = response;

    if (error) {
      throw error;
    }

    yield put(invoiceSuccess(invoice));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetInvoice() {
  yield takeLatest(GET_INVOICE, getInvoice);
}

function* getInvoices() {
  yield put(start(GET_INVOICES));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    try {
      const invoicesCollection = dbCollections(orgId).invoices;

      const q = query(
        invoicesCollection,
        orderBy('createdAt', 'desc'),
        where('status', '==', 0),
        where('transactionType', '==', 'invoice')
      );
      const snap = await getDocs(q);
      const invoices = snap.docs.map(invoiceDoc => {
        return {
          ...formatInvoiceDates({
            ...invoiceDoc.data(),
            invoiceId: invoiceDoc.id,
          }),
        };
      });

      return { invoices };
    } catch (error) {
      return { error };
    }
  }

  try {
    const response: InvoicesResponse = yield call(get);
    const { error, invoices } = response;

    if (error) {
      throw error;
    }

    console.log({ invoices });

    yield put(invoicesSuccess(invoices));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetInvoices() {
  yield takeLatest(GET_INVOICES, getInvoices);
}

function* getCustomerInvoices(action: PayloadAction<string>) {
  yield put(start(GET_CUSTOMER_INVOICES));
  const customerId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  // console.log({ customerId, statuses });
  async function get() {
    try {
      const invoicesCollection = dbCollections(orgId).invoices;
      const q = query(
        invoicesCollection,
        orderBy('createdAt', 'desc'),
        where('customer.id', '==', customerId),
        where('status', '==', 0),
        where('transactionType', '==', 'invoice')
      );
      const snap = await getDocs(q);

      const invoices = snap.docs.map(invoiceDoc => {
        return {
          ...formatInvoiceDates({
            ...invoiceDoc.data(),
            invoiceId: invoiceDoc.id,
          }),
        };
      });

      return { invoices };
    } catch (error) {
      return { error };
    }
  }

  try {
    const response: InvoicesResponse = yield call(get);
    const { invoices, error } = response;

    if (error) {
      throw error;
    }
    // console.log({ invoices });

    yield put(invoicesSuccess(invoices));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCustomerInvoices() {
  yield takeLatest(GET_CUSTOMER_INVOICES, getCustomerInvoices);
}

function* getCustomerUnpaidInvoices(action: PayloadAction<string>) {
  // console.log({ action });
  const { type, payload: customerId } = action;

  yield put(start(type));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  // console.log({ customerId, statuses });
  async function get() {
    try {
      const invoicesCollection = dbCollections(orgId).invoices;
      const q = query(
        invoicesCollection,
        // orderBy("createdAt", "asc"),
        where('customer.id', '==', customerId),
        where('status', '==', 0),
        where('balance', '>', 0)
      );

      const snap = await getDocs(q);
      const invoices = snap.docs.map(invoiceDoc => {
        return {
          ...formatInvoiceDates({
            ...invoiceDoc.data(),
            invoiceId: invoiceDoc.id,
          }),
        };
      });
      // console.log({ invoices });
      /**
       * sort by date
       */
      invoices.sort(sortByDateAsc);

      return { invoices };
    } catch (error) {
      return { error };
    }
  }

  try {
    const response: InvoicesResponse = yield call(get);
    const { error, invoices } = response;
    if (error) {
      throw error;
    }
    console.warn({ invoices });

    yield put(invoicesSuccess(invoices));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCustomerUnpaidInvoices() {
  yield takeLatest(GET_CUSTOMER_UNPAID_INVOICES, getCustomerUnpaidInvoices);
}

interface Details {
  paymentId: string;
  customerId: string;
}

function* getPaymentInvoicesToEdit(action: PayloadAction<Details>) {
  const {
    type,
    payload: { paymentId, customerId },
  } = action;
  yield put(start(type));
  console.log('fetching invoices to edit');
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  // console.log({ customerId, statuses });
  async function get() {
    try {
      const invoicesCollection = dbCollections(orgId).invoices;
      //paid invoices to edit
      const q1 = query(
        invoicesCollection,
        orderBy('createdAt', 'asc'),
        where('customer.id', '==', customerId),
        where('paymentsIds', 'array-contains', paymentId),
        where('status', '==', 0),
        where('balance', '==', 0)
      );
      //unpaid customer invoices
      const q2 = query(
        invoicesCollection,
        // orderBy("createdAt", "asc"),
        where('customer.id', '==', customerId),
        where('status', '==', 0),
        where('balance', '>', 0)
      );

      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

      const invoices1 = snap1.docs.map(invoiceDoc => {
        return {
          ...formatInvoiceDates({
            ...invoiceDoc.data(),
            invoiceId: invoiceDoc.id,
          }),
        };
      });
      const invoices2 = snap2.docs.map(invoiceDoc => {
        return {
          ...formatInvoiceDates({
            ...invoiceDoc.data(),
            invoiceId: invoiceDoc.id,
          }),
        };
      });
      /**
       * sort by date
       */
      invoices1.sort(sortByDateAsc);
      invoices2.sort(sortByDateAsc);
      console.log({ invoices1, invoices2 });

      return { invoices: [...invoices1, ...invoices2] };
    } catch (error) {
      return { error };
    }
  }

  try {
    const response: InvoicesResponse = yield call(get);
    const { invoices, error } = response;
    if (error) {
      throw error;
    }
    // console.log({ invoices });

    yield put(invoicesSuccess(invoices));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetPaymentInvoicesToEdit() {
  yield takeLatest(GET_PAYMENT_INVOICES_TO_EDIT, getPaymentInvoicesToEdit);
}

function* getPaymentInvoices(action: PayloadAction<Details>) {
  const { type, payload: paymentId } = action;
  yield put(start(type));
  console.log('fetching payment invoices');
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  // console.log({ customerId, statuses });
  async function get() {
    try {
      const invoicesCollection = dbCollections(orgId).invoices;
      //paid invoices to edit
      const q1 = query(
        invoicesCollection,
        orderBy('createdAt', 'asc'),
        where('paymentsIds', 'array-contains', paymentId),
        where('status', '==', 0)
      );

      const [snap] = await Promise.all([getDocs(q1)]);

      const invoices = snap.docs.map(invoiceDoc => {
        return {
          ...formatInvoiceDates({
            ...invoiceDoc.data(),
            invoiceId: invoiceDoc.id,
          }),
        };
      });

      return { invoices };
    } catch (error) {
      return { error };
    }
  }

  try {
    const response: InvoicesResponse = yield call(get);
    // console.log({ invoices });
    const { error, invoices } = response;

    if (error) {
      throw error;
    }

    yield put(invoicesSuccess(invoices));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetPaymentInvoices() {
  yield takeLatest(GET_PAYMENT_INVOICES, getPaymentInvoices);
}
