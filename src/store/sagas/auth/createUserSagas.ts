import { put, call, takeLatest } from "redux-saga/effects";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { auth, db } from "../../../utils/firebase";
import { CREATE_USER } from "../../actions/authActions";

import { start, success, fail } from "../../slices/authSlice";

import { UserProfile, SignupForm } from "../../../types";

function* createUser(action: PayloadAction<SignupForm>) {
  yield put(start(CREATE_USER));

  // console.log({ data });
  const { email, password, firstName, lastName } = action.payload;

  async function create() {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: `${firstName} ${lastName}`,
      });
    }
    const user = userCredential.user;
    const {
      displayName,
      phoneNumber,
      photoURL,
      providerId,
      uid,
      emailVerified,
      tenantId,
    } = user;

    // const tokenResult = await user.getIdTokenResult(true);
    // const claims = tokenResult.claims;

    await setDoc(
      doc(db, "users", user.uid),
      {
        displayName,
        phoneNumber,
        photoURL,
        providerId,
        uid,
        emailVerified,
        tenantId,
        org: "",
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return user;
  }

  try {
    const userProfile: UserProfile = yield call(create);
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
