import { put, call, takeLatest, select } from "redux-saga/effects";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { CREATE_ITEM_CATEGORY } from "../../actions/itemsCategoriesActions";
import {
  start,
  success,
  fail,
} from "../../slices/itemsCategories/modifyItemsCategoriesSlice";

function* createItemCategory({ data }) {
  yield put(start());
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email, orgs } = userProfile;
  console.log({ orgs });
  const orgId = orgs[0]?.orgId;

  function create() {
    return addDoc(collection(db, "organizations", orgId, "itemsCategories"), {
      ...data,
      orgId,
      status: "active",
      createdBy: email,
      modifiedBy: email,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(create);

    yield put(success());
  } catch (error) {
    console.log(error);
    yield put(fail(error));
  }
}

export function* watchCreateItemCategory() {
  yield takeLatest(CREATE_ITEM_CATEGORY, createItemCategory);
}
