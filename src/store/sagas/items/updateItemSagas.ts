import { put, call, takeLatest, select } from "redux-saga/effects";
import {
  doc,
  updateDoc,
  serverTimestamp,
  writeBatch,
  increment,
} from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";
import { createDailySummary } from "../../../utils/summaries";
import { getDateDetails } from "../../../utils/dates";

import { UPDATE_ITEM, DELETE_ITEM } from "../../actions/itemsActions";
import { start, success, fail } from "../../slices/itemsSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

import { getSimilarItem } from "./createItemSagas";

import { ItemFormData, UserProfile, RootState } from "../../../types";

interface UpdateData extends ItemFormData {
  itemId: string;
}

function* updateItem(action: PayloadAction<UpdateData>) {
  yield put(start(UPDATE_ITEM));
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const { name } = userProfile;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function update() {
    const { itemId, ...rest } = action.payload;
    const { sku } = rest;
    const similarItem = await getSimilarItem(orgId, sku);

    if (similarItem) {
      //check its not the same document being updated
      if (similarItem.itemId !== itemId) {
        throw new Error("There is another item with similar details!");
      }
    }

    console.log({ rest });
    return updateDoc(doc(db, "organizations", orgId, "items", itemId), {
      ...rest,
      modifiedBy: name,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Item successfully updated!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateItem() {
  yield takeLatest(UPDATE_ITEM, updateItem);
}

function* deleteItem(action: PayloadAction<string>) {
  yield put(start(DELETE_ITEM));
  const itemId = action.payload;
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const { name } = userProfile;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function update() {
    await createDailySummary(orgId);

    const { yearMonthDay } = getDateDetails();
    const itemRef = doc(db, "organizations", orgId, "items", itemId);
    const summaryRef = doc(
      db,
      "organizations",
      orgId,
      "summaries",
      yearMonthDay
    );

    const batch = writeBatch(db);

    batch.update(summaryRef, {
      items: increment(-1),
    });

    batch.update(itemRef, {
      status: "deleted",
      modifiedBy: name,
      modifiedAt: serverTimestamp(),
    });

    await batch.commit();
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Item successfully deleted!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteItem() {
  yield takeLatest(DELETE_ITEM, deleteItem);
}
