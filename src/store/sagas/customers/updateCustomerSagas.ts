import { put, call, select, takeLatest } from "redux-saga/effects";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";

import { createDailySummary } from "../../../utils/summaries";

import { UPDATE_CUSTOMER } from "../../actions/customersActions";
import { start, success, fail } from "../../slices/customersSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

import { CustomerFormData, RootState, UserProfile } from "../../../types";

interface updateData extends CustomerFormData {
  customerId: string;
}

function* updateCustomer(action: PayloadAction<updateData>) {
  yield put(start(UPDATE_CUSTOMER));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const { email } = userProfile;

  const { customerId, ...rest } = action.payload;

  async function update() {
    /**
     * initialize by creating daily summary if not available
     */
    await createDailySummary(orgId);
    /**
     * update customer data
     */
    await updateDoc(doc(db, "organizations", orgId, "customers", customerId), {
      ...rest,
      modifiedBy: email,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Customer UPDATED successfully!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateCustomer() {
  yield takeLatest(UPDATE_CUSTOMER, updateCustomer);
}
