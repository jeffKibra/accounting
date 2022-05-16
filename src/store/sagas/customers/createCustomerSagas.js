import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  doc,
  collection,
  serverTimestamp,
  writeBatch,
  increment,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { CREATE_CUSTOMER } from "../../actions/customersActions";
import { start, success, fail } from "../../slices/customersSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

function* createCustomer({ data }) {
  yield put(start(CREATE_CUSTOMER));

  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;

  console.log({ data });

  async function create() {
    const newDocRef = doc(collection(db, "organizations", orgId, "customers"));
    const countersRef = doc(
      db,
      "organizations",
      orgId,
      "summaries",
      "counters"
    );

    const batch = writeBatch(db);

    batch.update(countersRef, {
      customers: increment(1),
    });

    batch.set(newDocRef, {
      ...data,
      status: "active",
      summary: {
        invoices: 0,
        invoicesTotal: 0,
        payments: 0,
        paymentsTotal: 0,
      },
      createdBy: email,
      createdAt: serverTimestamp(),
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });

    await batch.commit();
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess("Customer added successfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateCustomer() {
  yield takeLatest(CREATE_CUSTOMER, createCustomer);
}
