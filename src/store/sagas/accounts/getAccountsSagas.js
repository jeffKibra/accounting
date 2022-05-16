import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  getDoc,
  getDocs,
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { GET_ACCOUNT, GET_ACCOUNTS } from "../../actions/accountsActions";
import {
  start,
  accountSuccess,
  accountsSuccess,
  fail,
} from "../../slices/accountsSlice";
import { error as toastError } from "../../slices/toastSlice";

const allStatuses = ["pending", "partially paid", "paid", "draft", "sent"];

export async function getLatestaccount(orgId) {
  console.log({ orgId });
  const q = query(
    collection(db, "organizations", orgId, "accounts"),
    orderBy("createdAt", "desc"),
    where("status", "in", allStatuses),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    return null;
  }

  const accountDoc = snap.docs[0];
  return {
    ...accountDoc.data(),
    accountId: accountDoc.id,
  };
}

function* getAccount({ accountId }) {
  yield put(start(GET_ACCOUNT));
  const orgId = yield select((state) => state.orgsReducer.org.id);

  async function get() {
    const accountDoc = await getDoc(
      doc(db, "organizations", orgId, "accounts", accountId)
    );
    if (!accountDoc.exists) {
      throw new Error("account not found!");
    }

    return {
      ...accountDoc.data(),
      accountId: accountDoc.id,
    };
  }

  try {
    const account = yield call(get);
    console.log({ account });

    yield put(accountSuccess(account));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetAccount() {
  yield takeLatest(GET_ACCOUNT, getAccount);
}

function* getAccounts({ mainTypes }) {
  yield put(start(GET_ACCOUNTS));
  const orgId = yield select((state) => state.orgsReducer.org.id);

  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "accounts"),
      where("status", "==", "active"),
      where("accountType.main", "in", mainTypes)
    );
    const accounts = [];
    const snap = await getDocs(q);

    snap.forEach((accountDoc) => {
      accounts.push({
        ...accountDoc.data(),
        accountId: accountDoc.id,
      });
    });

    return accounts;
  }

  try {
    const accounts = yield call(get);
    // console.log({ accounts });

    yield put(accountsSuccess(accounts));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetAccounts() {
  yield takeLatest(GET_ACCOUNTS, getAccounts);
}
