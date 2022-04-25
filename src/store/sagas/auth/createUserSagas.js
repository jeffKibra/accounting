import { put, call, takeLatest } from "redux-saga/effects";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

import { auth, db } from "../../../utils/firebase";
import { CREATE_USER, GET_USER_ORGS } from "../../actions/authActions";

import { start, success, fail, newUser } from "../../slices/authSlice";

function* createUser({ data }) {
  yield put(start());
  yield put(newUser(true));

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
        orgs: [],
      },
      { merge: true }
    );

    return claims;
  }

  try {
    const userProfile = yield call(create);
    // console.log({ userProfile });

    yield put(newUser(false));
    yield put(success(userProfile));
    yield put({ type: GET_USER_ORGS });
  } catch (error) {
    console.log(error);
    yield put(fail(error));
  }
}

export function* watchCreateUser() {
  yield takeLatest(CREATE_USER, createUser);
}
