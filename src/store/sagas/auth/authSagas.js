import { put, call, takeLatest, take, select } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  AUTH_LISTENER,
  LOGIN,
  LOGOUT,
  CREATE_USER,
} from "../../actions/authActions";
import { auth } from "../../../utils/firebase";

import { start, success, fail, reset } from "../../slices/authSlice";

function removeUser() {
  // console.log("removing current user if any!");
  //remove blog data
  localStorage.removeItem("org");
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
  } catch (error) {
    console.log(error);
    yield put(fail(error));
  }
}

export function* watchLogout(data) {
  yield takeLatest(LOGOUT, logout);
}

function authStateChannel() {
  return eventChannel((emit) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (userRecord) => emit({ userRecord }),
      (error) => {
        console.log(error);
        emit({ error });
      }
    );

    return unsubscribe;
  });
}

export function* activeAuthListener() {
  yield put(start(AUTH_LISTENER));
  const channel = yield call(authStateChannel);

  try {
    while (true) {
      const { userRecord, error } = yield take(channel);
      // console.log({ userRecord, error });

      if (error) {
        throw error;
      }

      let claims = null;

      if (userRecord) {
        async function getUser() {
          const user = await userRecord.getIdTokenResult();
          return user;
        }
        // console.log("user found");
        const user = yield call(getUser);

        claims = user.claims;
      } else {
        // console.log("no user logged in");
        claims = null;
      }

      const action = yield select((state) => state.authReducer.action);
      // console.log({ claims });

      if (action !== CREATE_USER) {
        yield put(success(claims));
      }
    }
  } catch (err) {
    console.log(err);
    yield put(fail(err));
  }
}

export function* watchAuthListener() {
  yield takeLatest(AUTH_LISTENER, activeAuthListener);
}

export function* login({ data }) {
  yield put(start(LOGIN));
  const { email, password } = data;

  async function signin() {
    const userRecord = await signInWithEmailAndPassword(auth, email, password);
    let claims = null;

    if (userRecord) {
      const user = await userRecord.user.getIdTokenResult();
      claims = user.claims;
    } else {
      claims = null;
    }

    return claims;
  }

  try {
    yield call(removeUser);

    const userProfile = yield call(signin);

    yield put(success(userProfile));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
  }
}

export function* watchLogin() {
  yield takeLatest(LOGIN, login);
}
