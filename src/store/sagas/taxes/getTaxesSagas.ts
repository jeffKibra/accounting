import { put, call, select, takeLatest } from "redux-saga/effects";
import {
  getDocs,
  query,
  orderBy,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { dbCollections } from "../../../utils/firebase";

import { start, taxSuccess, taxesSuccess, fail } from "../../slices/taxesSlice";
import { error as toastError } from "../../slices/toastSlice";

import { GET_TAXES, GET_TAX } from "../../actions/taxesActions";

import { RootState, Tax } from "../../../types";

function* getTaxes() {
  yield put(start(GET_TAXES));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    const taxesCollection = dbCollections(orgId).taxes;
    const q = query(
      taxesCollection,
      orderBy("createdAt", "desc"),
      where("status", "==", "active")
    );
    const snap = await getDocs(q);

    const taxes = snap.docs.map((taxDoc) => {
      return {
        taxId: taxDoc.id,
        ...taxDoc.data(),
      };
    });

    return taxes;
  }

  try {
    const taxes: Tax[] = yield call(get);

    yield put(taxesSuccess(taxes));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetTaxes() {
  yield takeLatest(GET_TAXES, getTaxes);
}

function* getTax(action: PayloadAction<string>) {
  yield put(start(GET_TAX));
  const taxId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    const taxesCollection = dbCollections(orgId).taxes;
    const taxDoc = await getDoc(doc(taxesCollection, taxId));

    if (!taxDoc.exists) {
      throw new Error("Tax details not found!");
    }

    return {
      ...taxDoc.data(),
      taxId,
    };
  }

  try {
    const tax: Tax = yield call(get);

    yield put(taxSuccess(tax));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetTax() {
  yield takeLatest(GET_TAX, getTax);
}
