import { put, call, select, takeLatest } from 'redux-saga/effects';
import {
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';

import { dbCollections } from '../../../utils/firebase';

import { GET_CUSTOMERS, GET_CUSTOMER } from '../../actions/customersActions';
import {
  start,
  customerSuccess,
  customersSuccess,
  fail,
} from '../../slices/customersSlice';
import { error as toastError } from '../../slices/toastSlice';

import { RootState, Customer } from '../../../types';

function* getCustomers() {
  yield put(start(GET_CUSTOMERS));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    const customersCollection = dbCollections(orgId).customers;
    const q = query(
      customersCollection,
      orderBy('createdAt', 'desc'),
      where('status', '==', 0)
    );
    const snap = await getDocs(q);
    const customers: Customer[] = snap.docs.map(customerDoc => {
      return {
        ...customerDoc.data(),
        customerId: customerDoc.id,
      };
    });

    return customers;
  }

  try {
    const customers: Customer[] = yield call(get);

    yield put(customersSuccess(customers));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCustomers() {
  yield takeLatest(GET_CUSTOMERS, getCustomers);
}

function* getCustomer(action: PayloadAction<string>) {
  yield put(start(GET_CUSTOMER));
  const customerId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    const customersCollection = dbCollections(orgId).customers;
    const customerDoc = await getDoc(doc(customersCollection, customerId));
    const customerData = customerDoc.data();

    if (!customerDoc.exists || !customerData) {
      throw new Error('Customer not found!');
    }

    return {
      ...customerData,
      customerId,
    };
  }

  try {
    const customer: Customer = yield call(get);

    yield put(customerSuccess(customer));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCustomer() {
  yield takeLatest(GET_CUSTOMER, getCustomer);
}
