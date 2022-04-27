import { put, takeLatest, select, call } from "redux-saga/effects";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { start, success, fail } from "../../slices/taxesSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";
import { CREATE_TAX } from "../../actions/taxesActions";

function* createTax({ data }) {
  yield put(start());
  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;

  async function create() {
    await addDoc(collection(db, "organizations", orgId, "taxes"), {
      ...data,
      status: "active",
      createdBy: email,
      modifiedBy: email,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess("Tax successfully created!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateTax() {
  yield takeLatest(CREATE_TAX, createTax);
}
