import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  updateDoc,
  doc,
  serverTimestamp,
  writeBatch,
  increment,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";

import {
  UPDATE_CUSTOMER,
  DELETE_CUSTOMER,
} from "../../actions/customersActions";
import { start, success, fail } from "../../slices/customersSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

function* updateCustomer({ data }) {
  yield put(start(UPDATE_CUSTOMER));

  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  const { customerId, ...rest } = data;

  async function update() {
    await updateDoc(doc(db, "organizations", orgId, "customers", customerId), {
      ...rest,
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Customer UPDATED successfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateCustomer() {
  yield takeLatest(UPDATE_CUSTOMER, updateCustomer);
}

function* deleteCustomer({ customerId }) {
  yield put(start(DELETE_CUSTOMER));

  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;

  async function update() {
    const customerRef = doc(
      db,
      "organizations",
      orgId,
      "customers",
      customerId
    );
    const countersRef = doc(
      db,
      "organizations",
      orgId,
      "summaries",
      "counters"
    );

    const batch = writeBatch(db);

    batch.update(countersRef, {
      customers: increment(-1),
    });

    batch.update(customerRef, {
      status: "deleted",
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });

    await batch.commit();
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Customer Deleted successfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteCustomer() {
  yield takeLatest(DELETE_CUSTOMER, deleteCustomer);
}
