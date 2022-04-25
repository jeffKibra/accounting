import { put, call, takeLatest, select } from "redux-saga/effects";

import { CHECK_ORG } from "../../actions/orgsActions";
import { start, orgSuccess, fail } from "../../slices/orgsSlice";

import { getOrg } from "./createOrgSagas";

function* checkOrg() {
  yield put(start(CHECK_ORG));
  const userProfile = yield select((state) => state.authReducer.userProfile);
  // console.log({ userProfile });

  try {
    let org = null;
    if (userProfile) {
      const { user_id } = userProfile;
      //check for a org in localstorage
      const orgJson = localStorage.getItem("org");
      if (orgJson) {
        org = JSON.parse(orgJson);
      }

      if (!org) {
        org = yield call(getOrg, user_id);
        if (org) {
          localStorage.setItem("org", JSON.stringify(org));
        }
      }
    }

    yield put(orgSuccess(org));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
  }
}

export function* watchCheckOrg() {
  yield takeLatest(CHECK_ORG, checkOrg);
}
