import { put, call, select, takeLatest } from "redux-saga/effects";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";

import { createDailySummary } from "../../../utils/summaries";

import { UPDATE_VENDOR } from "../../actions/vendorsActions";
import { start, success, fail } from "../../slices/vendorsSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

import { RootState, UserProfile, VendorFormData } from "../../../types";

interface UpdateData extends VendorFormData {
  vendorId: string;
}

function* updateVendor(action: PayloadAction<UpdateData>) {
  yield put(start(UPDATE_VENDOR));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const { email } = userProfile;

  const { vendorId, ...formData } = action.payload;

  async function update() {
    /**
     * initialize by creating daily summary if not available
     */
    await createDailySummary(orgId);
    /**
     * update vendor data
     */
    await updateDoc(doc(db, "organizations", orgId, "vendors", vendorId), {
      ...formData,
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Vendor successfully UPDATED!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateVendor() {
  yield takeLatest(UPDATE_VENDOR, updateVendor);
}
