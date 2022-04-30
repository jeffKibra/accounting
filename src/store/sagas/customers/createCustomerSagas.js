import { put, call, select, takeLatest } from "redux-saga/effects";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

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

  async function create() {
    await addDoc(collection(db, "organizations", orgId, "customers"), {
      ...data,
      status: "active",
      createdBy: email,
      createdAt: serverTimestamp(),
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
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
