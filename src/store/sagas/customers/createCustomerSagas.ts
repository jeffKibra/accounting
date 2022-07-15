import { put, call, select, takeLatest } from "redux-saga/effects";
import { doc, collection, runTransaction } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";
import { createDailySummary } from "../../../utils/summaries";
import { createCustomer } from "../../../utils/customers";

import { CREATE_CUSTOMER } from "../../actions/customersActions";
import { start, success, fail } from "../../slices/customersSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

import {
  CustomerFormData,
  RootState,
  Org,
  Account,
  UserProfile,
} from "../../../types";

function* createCustomerSaga(action: PayloadAction<CustomerFormData>) {
  yield put(start(CREATE_CUSTOMER));
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
    const newDocRef = doc(collection(db, "organizations", orgId, "customers"));
    const customerId = newDocRef.id;
    /**
     * create daily summary data
     */
    await createDailySummary(orgId);

    await runTransaction(db, async (transaction) => {
      await createCustomer(
        transaction,
        org,
        userProfile,
        accounts,
        customerId,
        action.payload
      );
    });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess("Customer added successfully!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateCustomer() {
  yield takeLatest(CREATE_CUSTOMER, createCustomerSaga);
}
