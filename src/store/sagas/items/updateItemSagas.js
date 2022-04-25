import { put, call, takeLatest, select } from "redux-saga/effects";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { UPDATE_ITEM } from "../../actions/itemsActions";
import { start, success, fail } from "../../slices/itemsSlice";

function* updateItem({ data }) {
  yield put(start(UPDATE_ITEM));
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { name } = userProfile;
  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;
  console.log({ data });

  function update() {
    const { itemId } = data;
    return updateDoc(doc(db, "organizations", orgId, "items", itemId), {
      ...data,
      modifiedBy: name,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
  } catch (error) {
    console.log(error);
    yield put(fail(error));
  }
}

export function* watchUpdateItem() {
  yield takeLatest(UPDATE_ITEM, updateItem);
}
