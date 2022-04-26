import { put, call, takeLatest, select } from "redux-saga/effects";
import {
  addDoc,
  serverTimestamp,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { CREATE_ITEM } from "../../actions/itemsActions";
import { start, success, fail } from "../../slices/itemsSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

export async function getSimilarItem(orgId, slug) {
  const q = query(
    collection(db, "organizations", orgId, "items"),
    orderBy("createdAt", "desc"),
    where("slug", "==", slug),
    where("status", "==", "active"),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    return null;
  }

  const itemDoc = snap.docs[0];

  return {
    ...itemDoc.data(),
    itemId: itemDoc.id,
  };
}

function* createItem({ data }) {
  yield put(start(CREATE_ITEM));
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { name } = userProfile;
  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;

  async function create() {
    const { slug } = data;
    //check if there is another item with similar itemId
    const similarItem = await getSimilarItem(orgId, slug);

    if (similarItem) {
      throw new Error("There is another item with similar details!");
    }

    return addDoc(collection(db, "organizations", orgId, "items"), {
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
    yield put(toastSuccess("Successfully created Item!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateItem() {
  yield takeLatest(CREATE_ITEM, createItem);
}
