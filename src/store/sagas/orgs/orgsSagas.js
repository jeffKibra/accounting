import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { call, put, takeLatest } from "redux-saga/effects";

import { db } from "../../../utils/firebase";

import {
  getOrgsStart,
  getOrgsSuccess,
  getOrgSuccess,
  getOrgsFail,
} from "../../slices/orgs/orgsSlice";
import { GET_ORGS, GET_ORG } from "../../actions/orgsActions";

function* getOrg({ orgId }) {
  yield put(getOrgsStart());

  async function fetchOrg() {
    const orgDoc = await getDoc(doc(db, "organizations", orgId));
    return orgDoc.data();
  }

  try {
    const org = yield call(fetchOrg);

    yield put(getOrgSuccess(org));
  } catch (err) {
    console.log(err);
    yield put(getOrgsFail(err));
  }
}

export function* watchGetOrg() {
  yield takeLatest(GET_ORG, getOrg);
}

function* getOrgs() {
  yield put(getOrgsStart());

  async function fetchOrgs() {
    const q = query(
      collection(db, "organizations"),
      where("status", "in", ["onboarding", "active", "suspended"])
    );
    const orgsSnap = await getDocs(q);
    const orgs = [];
    orgsSnap.forEach((doc) => {
      orgs.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return orgs;
  }

  try {
    const orgs = yield call(fetchOrgs);

    yield put(getOrgsSuccess(orgs));
  } catch (err) {
    console.log(err);
    yield put(getOrgsFail(err));
  }
}

export function* watchGetOrgs() {
  yield takeLatest(GET_ORGS, getOrgs);
}
