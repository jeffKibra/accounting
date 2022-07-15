import { put, call, select, takeLatest } from "redux-saga/effects";
import { doc, collection, runTransaction } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase/";
import { createDailySummary } from "../../../utils/summaries";
import { createVendor } from "../../../utils/vendors";

import { CREATE_VENDOR } from "../../actions/vendorsActions";
import { start, success, fail } from "../../slices/vendorsSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

import {
  Org,
  RootState,
  VendorFormData,
  UserProfile,
  Account,
} from "../../../types";

function* createVendorSaga(action: PayloadAction<VendorFormData>) {
  const { type, payload } = action;

  yield put(start(type));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const accounts: Account[] = yield select(
    (state: RootState) => state.accountsReducer.accounts
  );

  // console.log({ data });

  async function create() {
    const newDocRef = doc(collection(db, "organizations", orgId, "vendors"));
    const vendorId = newDocRef.id;
    /**
     * create daily summary data
     */
    await createDailySummary(orgId);

    await runTransaction(db, async (transaction) => {
      await createVendor(
        transaction,
        org,
        userProfile,
        accounts,
        vendorId,
        payload
      );
    });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess("Vendor added successfully!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateVendor() {
  yield takeLatest(CREATE_VENDOR, createVendorSaga);
}
