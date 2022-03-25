import { put, call, takeLatest, select } from "redux-saga/effects";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { EDIT_ORG } from "../../actions/orgsActions";
import {
  modifyOrgsStart,
  modifyOrgsSuccess,
  modifyOrgsFail,
} from "../../slices/orgs/modifyOrgsSlice";

function* updateOrg({ data }) {
  yield put(modifyOrgsStart());
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

    yield put(modifyOrgsSuccess());
  } catch (error) {
    console.log(error);
    yield put(modifyOrgsFail(error));
  }
}

export function* watchUpdateOrg() {
  yield takeLatest(EDIT_ORG, updateOrg);
}
