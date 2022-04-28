import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  getDocs,
  getDoc,
  doc,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { GET_CUSTOMERS, GET_CUSTOMER } from "../../actions/customersActions";
import {
  start,
  customerSuccess,
  customersSuccess,
  fail,
} from "../../slices/customersSlice";
import { error as toastError } from "../../slices/toastSlice";

function* getCustomers() {
  yield put(start(GET_CUSTOMERS));

  const orgId = yield select((state) => state.orgsReducer.org.id);

  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "customers"),
      orderBy("createdAt", "desc"),
      where("status", "==", "active")
    );
    const snap = await getDocs(q);
    const customers = [];

    snap.forEach((customerDoc) => {
      customers.push({
        ...customerDoc.data(),
        customerId: customerDoc.id,
      });
    });

    return customers;
  }

  try {
    const customers = yield call(get);

    yield put(customersSuccess(customers));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCustomers() {
  yield takeLatest(GET_CUSTOMERS, getCustomers);
}

function* getCustomer({ customerId }) {
  yield put(start(GET_CUSTOMER));

  const orgId = yield select((state) => state.orgsReducer.org.id);

  async function get() {
    const customerDoc = await getDoc(
      doc(db, "organizations", orgId, "customers", customerId)
    );
    if (!customerDoc.exists) {
      throw new Error("Customer not found!");
    }

    return {
      ...customerDoc.data(),
      customerId,
    };
  }

  try {
    const customer = yield call(get);

    yield put(customerSuccess(customer));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCustomer() {
  yield takeLatest(GET_CUSTOMER, getCustomer);
}
