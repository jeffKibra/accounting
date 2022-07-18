import { put, call, select, takeLatest } from "redux-saga/effects";
import { runTransaction } from "firebase/firestore";
import { PayloadAction } from "@reduxjs/toolkit";

import { db } from "../../../utils/firebase";
import { createDailySummary } from "../../../utils/summaries";
import { updateOpeningBalance } from "../../../utils/customers";

import { UPDATE_OPENING_BALANCE } from "../../actions/customersActions";
import { start, success, fail } from "../../slices/customersSlice";
import {
  success as toastSuccess,
  error as toastError,
} from "../../slices/toastSlice";

import {
  RootState,
  Account,
  UserProfile,
  OpeningBalanceFormData,
  Org,
} from "../../../types";

function* updateOpeningBalanceSaga(
  action: PayloadAction<OpeningBalanceFormData>
) {
  console.log({ action });
  yield put(start(UPDATE_OPENING_BALANCE));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const accounts: Account[] = yield select(
    (state: RootState) => state.accountsReducer.accounts
  );

  // console.log({ data });

  async function update() {
    /**
     * create daily summary data
     */
    await createDailySummary(orgId);
    /**
     * update opening balance using a transaction
     */
    await runTransaction(db, async (transaction) => {
      await updateOpeningBalance(
        transaction,
        org,
        userProfile,
        accounts,
        action.payload
      );
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess("Action successful!"));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateCustomerOpeningBalance() {
  yield takeLatest(UPDATE_OPENING_BALANCE, updateOpeningBalanceSaga);
}
