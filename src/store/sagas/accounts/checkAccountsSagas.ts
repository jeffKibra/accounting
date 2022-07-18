import { put, call, takeLatest, select } from "redux-saga/effects";
// import { accounts } from "../../../constants";
import { PayloadAction } from "@reduxjs/toolkit";

import { CHECK_ACCOUNTS } from "../../actions/accountsActions";
import { start, accountsSuccess, fail } from "../../slices/accountsSlice";
import { error as toastError } from "../../slices/toastSlice";

import { getAllAccounts } from "../../../utils/accounts";

import { RootState, Account } from "../../../types";

function* checkAccounts(action: PayloadAction<string>) {
  // const action = passedAction as Action;
  const { payload } = action;
  yield put(start(CHECK_ACCOUNTS));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId || ""
  );

  if (payload === "UPDATED") {
    /**
     * The accounts data has been updated
     * forcefully refetch accounts from db by deleting
     * loccaly saved accounts
     */
    localStorage.removeItem("accounts");
  }
  function fromStorage(): Account[] | null {
    //check for a accounts in localstorage
    const accountsJson = localStorage.getItem("accounts");
    if (accountsJson) {
      return JSON.parse(accountsJson);
    } else {
      return null;
    }
    // console.log({ accountsJson, accounts });
  }

  async function fetchFromDb(orgId: string) {
    const accounts: Account[] = await getAllAccounts(orgId);
    if (accounts) {
      localStorage.setItem("accounts", JSON.stringify(accounts));
    }
    return accounts;
  }

  async function fetchAccounts(orgId: string) {
    return fromStorage() || (await fetchFromDb(orgId));
  }

  try {
    if (orgId) {
      let accounts: Account[] = yield call(fetchAccounts, orgId);
      // console.log({ accounts });

      yield put(accountsSuccess(accounts));
    } else {
      throw new Error("accounts not found");
    }
  } catch (error) {
    console.log(error);
    const e = error as Error;
    yield put(fail(e));
    if (typeof error === "object") {
      yield put(toastError(e?.message));
    }
  }
}

export function* watchCheckAccounts() {
  yield takeLatest(CHECK_ACCOUNTS, checkAccounts);
}
