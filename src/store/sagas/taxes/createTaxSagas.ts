import { put, takeLatest, select, call } from "redux-saga/effects";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";

import { start, success, fail } from "../../slices/taxesSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";
import { CREATE_TAX } from "../../actions/taxesActions";

import { RootState, UserProfile, TaxForm } from "../../../types";

function* createTax(action: PayloadAction<TaxForm>) {
  yield put(start(CREATE_TAX));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const { email } = userProfile;

  async function create() {
    await addDoc(collection(db, "organizations", orgId, "taxes"), {
      ...action.payload,
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
    yield put(toastSuccess("Tax successfully created!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateTax() {
  yield takeLatest(CREATE_TAX, createTax);
}
