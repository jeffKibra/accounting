import {
  put,
  call,
  takeEvery,
  takeLatest,
  take,
  select,
} from "redux-saga/effects";
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
  GET_USER_ORGS,
} from "../../actions/authActions";
import { auth } from "../../../utils/firebase";

import {
  start,
  success,
  fail,
  reset,
  newUser,
} from "../../slices/auth/authSlice";

export function* logout() {
  yield put(start());
  console.log("logging out");

  function out() {
    return signOut(auth);
  }

  try {
    yield call(out);

    console.log("logged out!");
    yield put(reset());
  } catch (error) {
    console.log(error);
    yield put(fail(error));
  }
}

export function* watchLogout() {
  yield takeEvery(LOGOUT, logout);
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
  yield put(start());
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
        console.log("user found");
        const user = yield call(getUser);

        claims = user.claims;
      } else {
        console.log("no user logged in");
        claims = null;
      }

      const isNewUser = yield select((state) => state.authReducer.isNewUser);

      if (!isNewUser) {
        yield put(success(claims));

        yield put({ type: GET_USER_ORGS });
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
  yield put(start());
  yield put(newUser(true));
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
    const userProfile = yield call(signin);

    yield put(newUser(false));
    yield put(success(userProfile));

    yield put({ type: GET_USER_ORGS });
  } catch (error) {
    console.log(error);
    yield put(fail(error));
  }
}

export function* watchLogin() {
  yield takeLatest(LOGIN, login);
}
