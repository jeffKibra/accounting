import {
  collection,
  limit,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  setDoc,
  doc,
} from "firebase/firestore";
import { put, call, takeLatest, select } from "redux-saga/effects";

import { db } from "../../../utils/firebase";

import {
  modifyOrgsStart,
  modifyOrgsSuccess,
  modifyOrgsFail,
} from "../../slices/orgs/modifyOrgsSlice";
import { CREATE_ORG } from "../../actions/orgsActions";
import { GET_USER_ORGS } from "../../actions/authActions";

function* createOrg({ data }) {
  yield put(modifyOrgsStart());
  // console.log({ data });

  const userProfile = yield select((state) => state.authReducer.userProfile);

  function checkOrg(name) {
    const q = query(
      collection(db, "organizations"),
      where("name", "==", name),
      where("status", "in", ["onboarding", "active", "suspended"]),
      limit(1)
    );
    return getDocs(q).then((snap) => snap.empty);
  }

  async function saveData() {
    const orgRef = await addDoc(collection(db, "organizations"), {
      ...data,
      createdBy: userProfile?.email,
      modifiedBy: userProfile?.email,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });

    await setDoc(
      doc(db, "organizations", orgRef.id, "orgUsers", userProfile.sub),
      {
        name: userProfile.name,
        email: userProfile.email,
        uid: userProfile.sub,
        role: "owner",
        orgId: orgRef.id,
        createdAt: serverTimestamp(),
      }
    );

    return orgRef;
  }

  try {
    const isNewOrg = yield call(checkOrg, data.name);

    if (!isNewOrg) {
      throw new Error("An organization with a similar name already exists!");
    }

    yield call(saveData);

    yield put(modifyOrgsSuccess());
    yield put({ type: GET_USER_ORGS });
  } catch (err) {
    console.log(err);
    yield put(modifyOrgsFail(err));
  }
}

export function* watchCreateOrg() {
  yield takeLatest(CREATE_ORG, createOrg);
}
