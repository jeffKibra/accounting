import { put, call, select, takeLatest } from "redux-saga/effects";
import { doc, collection, runTransaction } from "firebase/firestore";

import { db } from "../../../utils/firebase";
import { createDailySummary } from "../../../utils/summaries";
import { createVendor } from "../../../utils/vendors";

import { CREATE_VENDOR } from "../../actions/vendorsActions";
import { start, success, fail } from "../../slices/vendorsSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

function* createVendorSaga({ data }) {
  yield put(start(CREATE_VENDOR));
  const org = yield select((state) => state.orgsReducer.org);
  const orgId = org.id;
  const userProfile = yield select((state) => state.authReducer.userProfile);
  const accounts = yield select((state) => state.accountsReducer.accounts);

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
        data
      );
    });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess("Vendor added successfully!"));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateVendor() {
  yield takeLatest(CREATE_VENDOR, createVendorSaga);
}
