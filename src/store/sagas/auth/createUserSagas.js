import { put, call, takeLatest } from "redux-saga/effects";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../../../utils/firebase";
import { CREATE_USER } from "../../actions/authActions";

import { start, success, fail } from "../../slices/authSlice";

function* createUser({ data }) {
  yield put(start(CREATE_USER));

  // console.log({ data });
  const { email, password, firstName, lastName } = data;

  async function create() {
    const userRecord = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(auth.currentUser, {
      displayName: `${firstName} ${lastName}`,
    });

    const user = await userRecord.user.getIdTokenResult(true);
    const claims = user.claims;

    await setDoc(
      doc(db, "users", claims.sub),
      {
        ...claims,
        org: "",
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return claims;
  }

  try {
    const userProfile = yield call(create);
    // console.log({ userProfile });

    yield put(success(userProfile));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
  }
}

export function* watchCreateUser() {
  yield takeLatest(CREATE_USER, createUser);
}
