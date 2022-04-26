import { put, call, takeLatest, select } from "redux-saga/effects";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { UPDATE_ITEM, DELETE_ITEM } from "../../actions/itemsActions";
import { start, success, fail } from "../../slices/itemsSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

import { getSimilarItem } from "./createItemSagas";

function* updateItem({ data }) {
  yield put(start(UPDATE_ITEM));
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { name } = userProfile;
  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;

  async function update() {
    const { itemId, slug } = data;
    const similarItem = await getSimilarItem(orgId, slug);

    if (similarItem) {
      //check its not the same document being updated
      if (similarItem.itemId !== itemId) {
        throw new Error("There is another item with similar details!");
      }
    }

    return updateDoc(doc(db, "organizations", orgId, "items", itemId), {
      ...data,
      modifiedBy: name,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Item successfully updated!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateItem() {
  yield takeLatest(UPDATE_ITEM, updateItem);
}

function* deleteItem({ itemId }) {
  yield put(start(DELETE_ITEM));
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { name } = userProfile;
  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;

  async function update() {
    return updateDoc(doc(db, "organizations", orgId, "items", itemId), {
      status: "deleted",
      modifiedBy: name,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Item successfully deleted!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteItem() {
  yield takeLatest(DELETE_ITEM, deleteItem);
}
