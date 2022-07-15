import { put, call, takeLatest } from "redux-saga/effects";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { auth, db } from "../../../utils/firebase";
import { CREATE_USER } from "../../actions/authActions";

import { start, success, fail } from "../../slices/authSlice";

interface createUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

function* createUser(action: PayloadAction<createUserData>) {
  yield put(start(CREATE_USER));

  // console.log({ data });
  const { email, password, firstName, lastName } = action.payload;

  async function create() {
    const userRecord = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: `${firstName} ${lastName}`,
      });
    }
    const user = userRecord.user;

    // const tokenResult = await user.getIdTokenResult(true);
    // const claims = tokenResult.claims;

    await setDoc(
      doc(db, "users", user.uid),
      {
        ...user,
        org: "",
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return user;
  }

  try {
    const userProfile: User = yield call(create);
    // console.log({ userProfile });

    yield put(success(userProfile));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
  }
}

export function* watchCreateUser() {
  yield takeLatest(CREATE_USER, createUser);
}
