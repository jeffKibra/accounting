import { put, call, takeLatest, take, select } from "redux-saga/effects";
import { eventChannel, EventChannel } from "redux-saga";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { PayloadAction } from "@reduxjs/toolkit";

import {
  AUTH_LISTENER,
  LOGIN,
  LOGOUT,
  CREATE_USER,
} from "../../actions/authActions";
import { auth } from "../../../utils/firebase";

import { RootState } from "../../../types";

import { start, success, fail, reset } from "../../slices/authSlice";

function removeUser() {
  // console.log("removing current user if any!");
  //remove blog data
  localStorage.removeItem("org");
  //remove accounts data
  localStorage.removeItem("accounts");
  //remove location data
  localStorage.removeItem("location");

  return signOut(auth);
}

export function* logout() {
  yield put(start(LOGOUT));
  console.log("logging out");

  try {
    yield call(removeUser);

    // console.log("logged out!");
    yield put(reset());
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
  }
}

export function* watchLogout() {
  yield takeLatest(LOGOUT, logout);
}

interface ChannelOutput {
  userRecord: User | null;
  error: Error | null;
}

export function* activeAuthListener() {
  yield put(start(AUTH_LISTENER));

  const authChannel: EventChannel<ChannelOutput> = eventChannel<ChannelOutput>(
    (emit) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (userRecord) => emit({ userRecord, error: null }),
        (err) => {
          const error = err as Error;
          console.log(error);
          emit({ error, userRecord: null });
        }
      );

      return unsubscribe;
    }
  );

  try {
    while (true) {
      const channelResult: ChannelOutput = yield take(authChannel);
      const { userRecord, error } = channelResult;
      // console.log({ userRecord, error });

      if (error) {
        throw error;
      }

      // if latest claims are required
      // let claims = null;
      // if (userRecord) {
      //   //const user: IdTokenResult = yield call(userRecord.getIdTokenResult);

      //   claims = user.claims;
      // } else {
      //   // console.log("no user logged in");
      //   claims = null;
      // }

      const action: string = yield select(
        (state: RootState) => state.authReducer.action
      );
      // console.log({ claims });

      if (action !== CREATE_USER) {
        yield put(success(userRecord));
      }
    }
  } catch (err) {
    console.log(err);
    const error = err as Error;
    yield put(fail(error));
  }
}

export function* watchAuthListener() {
  yield takeLatest(AUTH_LISTENER, activeAuthListener);
}

interface UserData {
  email: string;
  password: string;
}

export function* login(action: PayloadAction<UserData>) {
  yield put(start(LOGIN));
  const {
    payload: { email, password },
  } = action;

  async function signin() {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // let claims = null;

    // if (userCredential) {
    //   const user = await userCredential.user.getIdTokenResult();
    //   claims = user.claims;
    // } else {
    //   claims = null;
    // }

    return userCredential.user;
  }

  try {
    yield call(removeUser);

    const user: User = yield call(signin);

    yield put(success(user));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
  }
}

export function* watchLogin() {
  yield takeLatest(LOGIN, login);
}
