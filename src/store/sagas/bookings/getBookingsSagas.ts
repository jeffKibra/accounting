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
  GET_BOOKING,
  GET_BOOKINGS,
  GET_CUSTOMER_BOOKINGS,
  GET_CUSTOMER_UNPAID_BOOKINGS,
  GET_PAYMENT_BOOKINGS_TO_EDIT,
  GET_PAYMENT_BOOKINGS,
} from '../../actions/bookingsActions';
import {
  start,
  bookingSuccess,
  bookingsSuccess,
  fail,
} from '../../slices/bookingsSlice';
import { error as toastError } from '../../slices/toastSlice';

import { dateFromTimestamp } from '../../../utils/dates';

import { IBooking, RootState } from '../../../types';

//----------------------------------------------------------------

interface IBookingsResponse {
  bookings: IBooking[];
  error: Error;
}

interface IBookingResponse {
  booking: IBooking;
  error: Error;
}

//----------------------------------------------------------------

function formatBookingDates(booking: IBooking) {
  const { saleDate, dueDate, createdAt, modifiedAt } = booking;

  return {
    ...booking,
    saleDate: dateFromTimestamp(saleDate),
    dueDate: dateFromTimestamp(dueDate),
    createdAt: dateFromTimestamp(createdAt),
    modifiedAt: dateFromTimestamp(modifiedAt),
  };
}

function sortByDateAsc(bk1: unknown, bk2: unknown) {
  const booking1 = bk1 as IBooking;
  const booking2 = bk2 as IBooking;

  // console.log({ booking1, booking2 });
  const { createdAt: createdAt1 } = booking1;
  const { createdAt: createdAt2 } = booking2;

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

// function sortByDateDesc(booking1, booking2) {
// // console.log({ booking1, booking2 });
//   const { createdAt: createdAt1 } = booking1;
//   const { createdAt: createdAt2 } = booking2;

//   return createdAt2 - createdAt1;
// }

function* getBooking(action: PayloadAction<string>) {
  yield put(start(GET_BOOKING));
  const bookingId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  // console.log({ bookingId });

  async function get() {
    try {
      const bookingsCollection = dbCollections(orgId).bookings;
      const bookingDoc = await getDoc(doc(bookingsCollection, bookingId));
      const booking = bookingDoc.data();
      if (!bookingDoc.exists || !booking) {
        throw new Error('Booking not found!');
      }

      return {
        booking: formatBookingDates({ ...booking, id: bookingDoc.id }),
      };
    } catch (error) {
      return { error };
    }
  }

  try {
    const response: IBookingResponse = yield call(get);
    const { error, booking } = response;

    if (error) {
      throw error;
    }

    yield put(bookingSuccess(booking));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetBooking() {
  yield takeLatest(GET_BOOKING, getBooking);
}

function* getBookings() {
  yield put(start(GET_BOOKINGS));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    try {
      const bookingsCollection = dbCollections(orgId).bookings;

      const q = query(
        bookingsCollection,
        orderBy('createdAt', 'desc'),
        where('status', '==', 0),
        where('transactionType', '==', 'booking')
      );
      const snap = await getDocs(q);
      const bookings = snap.docs.map(bookingDoc => {
        return {
          ...formatBookingDates({
            ...bookingDoc.data(),
            id: bookingDoc.id,
          }),
        };
      });

      return { bookings };
    } catch (error) {
      return { error };
    }
  }

  try {
    const response: IBookingsResponse = yield call(get);
    const { error, bookings } = response;

    if (error) {
      throw error;
    }

    // console.log({ bookings });

    yield put(bookingsSuccess(bookings));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetBookings() {
  yield takeLatest(GET_BOOKINGS, getBookings);
}

function* getCustomerBookings(action: PayloadAction<string>) {
  yield put(start(GET_CUSTOMER_BOOKINGS));
  const customerId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  // console.log({ customerId, statuses });
  async function get() {
    try {
      const bookingsCollection = dbCollections(orgId).bookings;
      const q = query(
        bookingsCollection,
        orderBy('createdAt', 'desc'),
        where('customer.id', '==', customerId),
        where('status', '==', 0),
        where('transactionType', '==', 'booking')
      );
      const snap = await getDocs(q);

      const bookings = snap.docs.map(bookingDoc => {
        return {
          ...formatBookingDates({
            ...bookingDoc.data(),
            id: bookingDoc.id,
          }),
        };
      });

      return { bookings };
    } catch (error) {
      return { error };
    }
  }

  try {
    const response: IBookingsResponse = yield call(get);
    const { bookings, error } = response;

    if (error) {
      throw error;
    }
    // console.log({ bookings });

    yield put(bookingsSuccess(bookings));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCustomerBookings() {
  yield takeLatest(GET_CUSTOMER_BOOKINGS, getCustomerBookings);
}

function* getCustomerUnpaidBookings(action: PayloadAction<string>) {
  // console.log({ action });
  const { type, payload: customerId } = action;

  yield put(start(type));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  // console.log({ customerId, statuses });
  async function get() {
    try {
      const bookingsCollection = dbCollections(orgId).bookings;
      const q = query(
        bookingsCollection,
        // orderBy("createdAt", "asc"),
        where('customer.id', '==', customerId),
        where('status', '==', 0),
        where('balance', '>', 0)
      );

      const snap = await getDocs(q);
      const bookings = snap.docs.map(bookingDoc => {
        return {
          ...formatBookingDates({
            ...bookingDoc.data(),
            id: bookingDoc.id,
          }),
        };
      });
      // console.log({ bookings });
      /**
       * sort by date
       */
      bookings.sort(sortByDateAsc);

      return { bookings };
    } catch (error) {
      return { error };
    }
  }

  try {
    const response: IBookingsResponse = yield call(get);
    const { error, bookings } = response;
    if (error) {
      throw error;
    }
    console.warn({ bookings });

    yield put(bookingsSuccess(bookings));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCustomerUnpaidBookings() {
  yield takeLatest(GET_CUSTOMER_UNPAID_BOOKINGS, getCustomerUnpaidBookings);
}

interface Details {
  paymentId: string;
  customerId: string;
}

function* getPaymentBookingsToEdit(action: PayloadAction<Details>) {
  const {
    type,
    payload: { paymentId, customerId },
  } = action;
  yield put(start(type));
  // console.log('fetching bookings to edit');
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  // console.log({ customerId, statuses });
  async function get() {
    try {
      const bookingsCollection = dbCollections(orgId).bookings;
      //paid bookings to edit
      const q1 = query(
        bookingsCollection,
        orderBy('createdAt', 'asc'),
        where('customer.id', '==', customerId),
        where('paymentsIds', 'array-contains', paymentId),
        where('status', '==', 0),
        where('balance', '==', 0)
      );
      //unpaid customer bookings
      const q2 = query(
        bookingsCollection,
        // orderBy("createdAt", "asc"),
        where('customer.id', '==', customerId),
        where('status', '==', 0),
        where('balance', '>', 0)
      );

      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

      const bookings1 = snap1.docs.map(bookingDoc => {
        return {
          ...formatBookingDates({
            ...bookingDoc.data(),
            id: bookingDoc.id,
          }),
        };
      });
      const bookings2 = snap2.docs.map(bookingDoc => {
        return {
          ...formatBookingDates({
            ...bookingDoc.data(),
            id: bookingDoc.id,
          }),
        };
      });
      /**
       * sort by date
       */
      bookings1.sort(sortByDateAsc);
      bookings2.sort(sortByDateAsc);
      // console.log({ bookings1, bookings2 });

      return { bookings: [...bookings1, ...bookings2] };
    } catch (error) {
      return { error };
    }
  }

  try {
    const response: IBookingsResponse = yield call(get);
    const { bookings, error } = response;
    if (error) {
      throw error;
    }
    // console.log({ bookings });

    yield put(bookingsSuccess(bookings));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetPaymentBookingsToEdit() {
  yield takeLatest(GET_PAYMENT_BOOKINGS_TO_EDIT, getPaymentBookingsToEdit);
}

function* getPaymentBookings(action: PayloadAction<Details>) {
  const { type, payload: paymentId } = action;
  yield put(start(type));
  // console.log('fetching payment bookings');
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  // console.log({ customerId, statuses });
  async function get() {
    try {
      const bookingsCollection = dbCollections(orgId).bookings;
      //paid bookings to edit
      const q1 = query(
        bookingsCollection,
        orderBy('createdAt', 'asc'),
        where('paymentsIds', 'array-contains', paymentId),
        where('status', '==', 0)
      );

      const [snap] = await Promise.all([getDocs(q1)]);

      const bookings = snap.docs.map(bookingDoc => {
        return {
          ...formatBookingDates({
            ...bookingDoc.data(),
            id: bookingDoc.id,
          }),
        };
      });

      return { bookings };
    } catch (error) {
      return { error };
    }
  }

  try {
    const response: IBookingsResponse = yield call(get);
    // console.log({ bookings });
    const { error, bookings } = response;

    if (error) {
      throw error;
    }

    yield put(bookingsSuccess(bookings));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetPaymentBookings() {
  yield takeLatest(GET_PAYMENT_BOOKINGS, getPaymentBookings);
}
