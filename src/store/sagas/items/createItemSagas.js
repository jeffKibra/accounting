import { put, call, takeLatest, select } from "redux-saga/effects";
import {
  doc,
  serverTimestamp,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  runTransaction,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { CREATE_ITEM } from "../../actions/itemsActions";
import { start, success, fail } from "../../slices/itemsSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

export async function getSimilarItem(orgId, sku) {
  const q = query(
    collection(db, "organizations", orgId, "items"),
    orderBy("createdAt", "desc"),
    where("sku", "==", sku),
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
  // console.log({ data });
  async function create() {
    const { sku } = data;
    //check if there is another item with similar itemId
    const similarItem = await getSimilarItem(orgId, sku);
    if (similarItem) {
      throw new Error("There is another item with similar details!");
    }

    const newDocRef = doc(collection(db, "organizations", orgId, "items"));
    const orgRef = doc(db, "organizations", orgId);

    await runTransaction(db, async (transaction) => {
      const orgDoc = await transaction.get(orgRef);
      if (!orgDoc.exists) {
        throw new Error("Organization data not found!");
      }
      const orgData = orgDoc.data();
      const orgSummary = orgData.summary;

      let items = orgSummary.items || 0;

      transaction.update(orgRef, {
        "summary.items": items + 1,
      });

      transaction.set(newDocRef, {
        ...data,
        status: "active",
        createdBy: name,
        modifiedBy: name,
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      });
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
