import { put, call, select, takeLatest } from "redux-saga/effects";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

import { db } from "../../../utils/firebase";

import { createDailySummary } from "../../../utils/summaries";

import { UPDATE_VENDOR } from "../../actions/vendorsActions";
import { start, success, fail } from "../../slices/vendorsSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

function* updateVendor({ data }) {
  yield put(start(UPDATE_VENDOR));

  const orgId = yield select((state) => state.orgsReducer.org.id);
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const { email } = userProfile;

  const { vendorId, ...rest } = data;

  async function update() {
    /**
     * initialize by creating daily summary if not available
     */
    await createDailySummary(orgId);
    /**
     * update vendor data
     */
    await updateDoc(doc(db, "organizations", orgId, "vendors", vendorId), {
      ...rest,
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Vendor successfully UPDATED!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateVendor() {
  yield takeLatest(UPDATE_VENDOR, updateVendor);
}
