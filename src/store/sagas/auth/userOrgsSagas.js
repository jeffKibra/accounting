import { put, call, takeLatest, select } from "redux-saga/effects";
import { getDocs, collectionGroup, query, where } from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { GET_USER_ORGS } from "../../actions/authActions";
import { start, fail, userOrgsSuccess } from "../../slices/auth/authSlice";

export function* userOrgs() {
  yield put(start());
  const userProfile = yield select((state) => state.authReducer.userProfile);

  function getOrgs() {
    const q = query(
      collectionGroup(db, "orgUsers"),
      where("uid", "==", userProfile.sub)
    );
    return getDocs(q).then((snap) => {
      const orgs = [];
      snap.forEach((doc) => {
        orgs.push(doc.data());
      });

      return orgs;
    });
  }

  try {
    const orgs = yield call(getOrgs);
    // console.log({ orgs });

    yield put(userOrgsSuccess(orgs));
  } catch (err) {
    console.log(err);
    yield put(fail(err));
  }
}

export function* watchUserOrgs() {
  yield takeLatest(GET_USER_ORGS, userOrgs);
}
