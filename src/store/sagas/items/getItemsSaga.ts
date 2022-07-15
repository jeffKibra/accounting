import { put, call, takeLatest, select } from "redux-saga/effects";
import {
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db, dbCollections } from "../../../utils/firebase";

import { GET_ITEMS, GET_ITEM } from "../../actions/itemsActions";
import {
  start,
  itemSuccess,
  itemsSuccess,
  fail,
} from "../../slices/itemsSlice";
import { error as toastError } from "../../slices/toastSlice";

import { RootState, Item } from "../../../types";

function* getItems() {
  yield put(start(GET_ITEMS));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  // const orgId = org.id;

  async function get() {
    const itemsCollection = dbCollections(orgId).items;
    const q = query(
      itemsCollection,
      orderBy("createdAt", "desc"),
      where("status", "==", "active")
    );
    const snap = await getDocs(q);
    const items = snap.docs.map((itemDoc) => {
      return {
        ...itemDoc.data(),
        itemId: itemDoc.id,
      };
    });

    return items;
  }

  try {
    const items: Item[] = yield call(get);
    // console.log({ items });

    yield put(itemsSuccess(items));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetItems() {
  yield takeLatest(GET_ITEMS, getItems);
}

function* getItem(action: PayloadAction<string>) {
  yield put(start(GET_ITEM));
  const itemId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

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
    const item: Item = yield call(get);

    yield put(itemSuccess(item));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetItem() {
  yield takeLatest(GET_ITEM, getItem);
}
