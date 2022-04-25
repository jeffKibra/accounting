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

import { start, orgsSuccess, orgSuccess, fail } from "../../slices/orgsSlice";
import { GET_ORGS, GET_ORG } from "../../actions/orgsActions";

function* getOrg({ orgId }) {
  yield put(start(GET_ORG));

  async function fetchOrg() {
    const orgDoc = await getDoc(doc(db, "organizations", orgId));
    return orgDoc.data();
  }

  try {
    const org = yield call(fetchOrg);

    yield put(orgSuccess(org));
  } catch (err) {
    console.log(err);
    yield put(fail(err));
  }
}

export function* watchGetOrg() {
  yield takeLatest(GET_ORG, getOrg);
}

function* getOrgs() {
  yield put(start(GET_ORGS));

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

    yield put(orgsSuccess(orgs));
  } catch (err) {
    console.log(err);
    yield put(fail(err));
  }
}

export function* watchGetOrgs() {
  yield takeLatest(GET_ORGS, getOrgs);
}
