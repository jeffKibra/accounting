import { put, call, takeLatest, select } from "redux-saga/effects";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { EDIT_ORG } from "../../actions/orgsActions";
import { start, success, fail } from "../../slices/orgsSlice";

function* updateOrg({ data }) {
  yield put(start(EDIT_ORG));
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
  } catch (error) {
    console.log(error);
    yield put(fail(error));
  }
}

export function* watchUpdateOrg() {
  yield takeLatest(EDIT_ORG, updateOrg);
}
