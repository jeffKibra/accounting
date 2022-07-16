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

import { RootState, UserProfile } from "../../../types";

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
  user: User | null;
  error: Error | null;
}

export function* activeAuthListener() {
  yield put(start(AUTH_LISTENER));

  const authChannel: EventChannel<ChannelOutput> = eventChannel<ChannelOutput>(
    (emit) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          // // if latest claims are required
          // let claims: ParsedToken | null = null;
          // if (user) {
          //   const tokenResult = await user.getIdTokenResult();
          //   const tokenRe = await user.getIdToken();
          //   console.log({ tokenRe, tokenResult });

          //   claims = tokenResult.claims;
          // } else {
          //   // console.log("no user logged in");
          //   claims = null;
          // }

          // console.log({ claims });

          emit({ user, error: null });
        },
        (err) => {
          const error = err as Error;
          console.log(error);
          emit({ error, user: null });
        }
      );

      return unsubscribe;
    }
  );

  try {
    while (true) {
      const channelResult: { user: UserProfile; error: Error } = yield take(
        authChannel
      );
      const { user, error } = channelResult;
      console.log({ user, error });

      if (error) {
        throw error;
      }

      const action: string = yield select(
        (state: RootState) => state.authReducer.action
      );
      // console.log({ claims });

      if (action !== CREATE_USER) {
        if (user) {
          yield put(success(user));
        } else {
          yield put(success(null));
        }
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
  console.log({ action });
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

    //uncoment if custom claims have been provided
    // let claims: ParsedToken | null = null;

    // if (userCredential) {
    //   const user = await userCredential.user.getIdTokenResult();

    //   console.log({ user });
    //   claims = user.claims;
    // } else {
    //   claims = null;
    // }

    return userCredential.user;
  }

  try {
    yield call(removeUser);

    const user: UserProfile = yield call(signin);
    console.log({ user });

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
