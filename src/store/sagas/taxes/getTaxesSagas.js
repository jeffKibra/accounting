import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  getDocs,
  collection,
  query,
  orderBy,
  where,
  getDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { start, taxSuccess, taxesSuccess, fail } from "../../slices/taxesSlice";
import { error as toastError } from "../../slices/toastSlice";

import { GET_TAXES, GET_TAX } from "../../actions/taxesActions";

function* getTaxes() {
  yield put(start(GET_TAXES));
  const orgId = yield select((state) => state.orgsReducer.org.id);

  async function get() {
    const q = query(
      collection(db, "organizations", orgId, "taxes"),
      orderBy("createdAt", "desc"),
      where("status", "==", "active")
    );
    const snap = await getDocs(q);

    const taxes = [];
    snap.forEach((taxDoc) => {
      taxes.push({
        taxId: taxDoc.id,
        ...taxDoc.data(),
      });
    });

    return taxes;
  }

  try {
    const taxes = yield call(get);

    console.log({ taxes });

    yield put(taxesSuccess(taxes));
  } catch (error) {
    console.log({ error });
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetTaxes() {
  yield takeLatest(GET_TAXES, getTaxes);
}

function* getTax({ taxId }) {
  yield put(start(GET_TAX));
  const orgId = yield select((state) => state.orgsReducer.org.id);

  async function get() {
    const taxDoc = await getDoc(
      doc(db, "organizations", orgId, "taxes", taxId)
    );

    if (!taxDoc.exists) {
      throw new Error("Tax details not found!");
    }

    return {
      ...taxDoc.data(),
      taxId,
    };
  }

  try {
    const tax = yield call(get);

    console.log({ tax });

    yield put(taxSuccess(tax));
  } catch (error) {
    console.log({ error });
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetTax() {
  yield takeLatest(GET_TAX, getTax);
}
