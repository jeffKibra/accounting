import {
  collection,
  limit,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  getDoc,
} from "firebase/firestore";
import { put, call, takeLatest, select } from "redux-saga/effects";

import { db } from "../../../utils/firebase";

import { start, success, fail } from "../../slices/orgsSlice";
import { CREATE_ORG } from "../../actions/orgsActions";

export function getOrg(userId) {
  const q = query(
    collection(db, "organizations"),
    where("owner", "==", userId),
    where("status", "in", ["onboarding", "active", "suspended"]),
    limit(1)
  );

  return getDocs(q).then((snap) => {
    if (snap.empty) {
      return null;
    }

    const orgDoc = snap.docs[0];

    return {
      ...orgDoc.data(),
      orgId: orgDoc.id,
      id: orgDoc.id,
    };
  });
}

function* createOrg({ data }) {
  yield put(start(CREATE_ORG));
  // console.log({ data });

  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email, user_id } = userProfile;

  async function saveData() {
    const orgRef = await addDoc(collection(db, "organizations"), {
      ...data,
      status: "active",
      createdBy: email,
      modifiedBy: email,
      owner: user_id,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });

    const orgDoc = await getDoc(orgRef);

    return {
      ...orgDoc.data(),
      orgId: orgDoc.id,
      id: orgDoc.id,
    };
  }

  try {
    const userHasOrg = yield call(getOrg, data.name);

    if (userHasOrg) {
      throw new Error("The User already has an orgnaization account!");
    }

    const org = yield call(saveData);
    // console.log({ org });

    yield put(success(org));
  } catch (err) {
    console.log(err);
    yield put(fail(err));
  }
}

export function* watchCreateOrg() {
  yield takeLatest(CREATE_ORG, createOrg);
}
