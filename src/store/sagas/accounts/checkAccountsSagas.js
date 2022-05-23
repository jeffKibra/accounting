import { put, call, takeLatest, select } from "redux-saga/effects";
import accounts from "../../../utils/accounts";

import { CHECK_ACCOUNTS } from "../../actions/accountsActions";
import { start, accountsSuccess, fail } from "../../slices/accountsSlice";
import { error as toastError } from "../../slices/toastSlice";

import { getAllAccounts } from "./getAccountsSagas";

function* checkAccounts({ status }) {
  yield put(start(CHECK_ACCOUNTS));

  const orgId = yield select((state) => state.orgsReducer.org.id);

  if (status === "UPDATED") {
    /**
     * The accounts data has been updated
     * forcefully refetch accounts from db by deleting
     * loccaly saved accounts
     */
    localStorage.removeItem(accounts);
  }

  try {
    let accounts = null;
    if (orgId) {
      //check for a accounts in localstorage
      const accountsJson = localStorage.getItem("accounts");
      if (accountsJson) {
        accounts = JSON.parse(accountsJson);
      }
      // console.log({ accountsJson, accounts });

      if (!accounts) {
        accounts = yield call(getAllAccounts, orgId);
        if (accounts) {
          localStorage.setItem("accounts", JSON.stringify(accounts));
        }
        // console.log({ accounts });
      }
    }

    yield put(accountsSuccess(accounts));
  } catch (error) {
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCheckAccounts() {
  yield takeLatest(CHECK_ACCOUNTS, checkAccounts);
}
