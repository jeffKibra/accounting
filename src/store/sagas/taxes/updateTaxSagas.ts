import { put, takeLatest, select, call } from "redux-saga/effects";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";

import { start, success, fail } from "../../slices/taxesSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";
import { UPDATE_TAX, DELETE_TAX } from "../../actions/taxesActions";

import { RootState, UserProfile, TaxForm } from "../../../types";

interface UpdateData extends TaxForm {
  taxId: string;
}

function* updateTax(action: PayloadAction<UpdateData>) {
  yield put(start(UPDATE_TAX));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const { email } = userProfile;
  const { taxId, ...rest } = action.payload;

  async function update() {
    await updateDoc(doc(db, "organizations", orgId, "taxes", taxId), {
      ...rest,
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Tax successfully updated!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateTax() {
  yield takeLatest(UPDATE_TAX, updateTax);
}

function* deleteTax(action: PayloadAction<string>) {
  yield put(start(DELETE_TAX));
  const taxId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const { email } = userProfile;

  async function update() {
    await updateDoc(doc(db, "organizations", orgId, "taxes", taxId), {
      status: "deleted",
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Tax successfully Deleted!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteTax() {
  yield takeLatest(DELETE_TAX, deleteTax);
}
