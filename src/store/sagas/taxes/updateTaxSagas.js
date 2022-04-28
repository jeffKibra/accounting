import { put, takeLatest, select, call } from "redux-saga/effects";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { start, success, fail } from "../../slices/taxesSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";
import { UPDATE_TAX, DELETE_TAX } from "../../actions/taxesActions";

function* updateTax({ data }) {
  yield put(start(UPDATE_TAX));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;
  console.log({ data });
  const { taxId, ...rest } = data;

  async function update() {
    await updateDoc(doc(db, "organizations", orgId, "taxes", taxId), {
      ...rest,
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Tax successfully updated!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateTax() {
  yield takeLatest(UPDATE_TAX, updateTax);
}

function* deleteTax({ taxId }) {
  yield put(start(DELETE_TAX));
  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;

  async function update() {
    await updateDoc(doc(db, "organizations", orgId, "taxes", taxId), {
      status: "deleted",
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Tax successfully Deleted!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteTax() {
  yield takeLatest(DELETE_TAX, deleteTax);
}
