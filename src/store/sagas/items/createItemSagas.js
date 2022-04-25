import { put, call, takeLatest, select } from "redux-saga/effects";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { CREATE_ITEM } from "../../actions/itemsActions";
import { start, success, fail } from "../../slices/itemsSlice";

function* createItem({ data }) {
  yield put(start(CREATE_ITEM));
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { name } = userProfile;
  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;

  function create() {
    const { itemId } = data;
    return setDoc(doc(db, "organizations", orgId, "items", itemId), {
      ...data,
      status: "active",
      createdBy: name,
      modifiedBy: name,
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

export function* watchCreateItem() {
  yield takeLatest(CREATE_ITEM, createItem);
}
