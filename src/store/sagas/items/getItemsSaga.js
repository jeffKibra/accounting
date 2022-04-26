import { put, call, takeLatest, select } from "redux-saga/effects";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
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
import { error as toastError } from "../../slices/toastSlice";

function* getItems() {
  yield put(start(GET_ITEMS));

  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;

  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "items"),
      orderBy("createdAt", "desc"),
      where("status", "==", "active")
    );
    const snap = await getDocs(q);
    const items = [];
    snap.forEach((itemDoc) => {
      items.push({
        ...itemDoc.data(),
        itemId: itemDoc.id,
      });
    });

    return items;
  }

  try {
    const items = yield call(get);
    // console.log({ items });

    yield put(itemsSuccess(items));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetItems() {
  yield takeLatest(GET_ITEMS, getItems);
}

function* getItem({ itemId }) {
  yield put(start(GET_ITEM));

  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;

  async function get() {
    const itemDoc = await getDoc(
      doc(db, "organizations", orgId, "items", itemId)
    );

    if (!itemDoc.exists) {
      throw new Error("item not found!");
    }

    return {
      ...itemDoc.data(),
      itemId: itemDoc.id,
    };
  }

  try {
    const item = yield call(get);

    yield put(itemSuccess(item));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetItem() {
  yield takeLatest(GET_ITEM, getItem);
}
