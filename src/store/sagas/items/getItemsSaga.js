import { put, call, takeLatest, select } from "redux-saga/effects";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { GET_ITEMS, GET_ITEM } from "../../actions/itemsActions";
import {
  start,
  itemSuccess,
  itemsSuccess,
  fail,
} from "../../slices/itemsSlice";

function* getItems() {
  yield put(start(GET_ITEMS));

  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;

  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "items"),
      where("status", "==", "active")
    );
    const snap = await getDocs(q);
    const items = [];
    snap.forEach((doc) => {
      items.push(doc.data());
    });

    return items;
  }

  try {
    const items = yield call(get);
    console.log({ items });

    yield put(itemsSuccess(items));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
  }
}

export function* watchGetItems() {
  yield takeLatest(GET_ITEMS, getItems);
}

function* getItem({ itemId }) {
  yield put(start(GET_ITEM));
  console.log({ itemId });

  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;

  async function get() {
    const itemDoc = await getDoc(
      doc(db, "organizations", orgId, "items", itemId)
    );

    if (!itemDoc.exists) {
      throw new Error("item not found!");
    }

    return itemDoc.data();
  }

  try {
    const item = yield call(get);

    yield put(itemSuccess(item));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
  }
}

export function* watchGetItem() {
  yield takeLatest(GET_ITEM, getItem);
}
