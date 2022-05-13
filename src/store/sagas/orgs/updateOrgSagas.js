import { put, call, takeLatest, select } from "redux-saga/effects";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { UPDATE_ORG } from "../../actions/orgsActions";
import { start, success, fail } from "../../slices/orgsSlice";
import {
  error as toastError,
  success as toastSuccess,
} from "../../slices/toastSlice";

function* updateOrg({ data }) {
  yield put(start(UPDATE_ORG));
  const userProfile = yield select((state) => state.authReducer.userProfile);

  //   console.log({ data, userProfile });
  const { id, ...rest } = data;

  function update() {
    return updateDoc(doc(db, "organizations", id), {
      ...rest,
      modifiedBy: userProfile?.email,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Organization successfully updated!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateOrg() {
  yield takeLatest(UPDATE_ORG, updateOrg);
}
