import { put, call, takeLatest, select } from 'redux-saga/effects';
// import { accounts } from "../../../constants";
import { PayloadAction } from '@reduxjs/toolkit';

import { CHECK_ACCOUNTS } from '../../actions/accountsActions';
import { start, accountsSuccess, fail } from '../../slices/accountsSlice';
import { error as toastError } from '../../slices/toastSlice';

import { getAllAccounts } from '../../../utils/accounts';

import { RootState, Account } from '../../../types';

function* checkAccounts(action: PayloadAction<string>) {
  // const action = passedAction as Action;
  // const { payload } = action;
  yield put(start(CHECK_ACCOUNTS));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId || ''
  );

  // if (payload === 'UPDATED') {
  //   /**
  //    * The accounts data has been updated
  //    * forcefully refetch accounts from db by deleting
  //    * loccaly saved accounts
  //    */
  //   yield put(accountsSuccess(null));
  // }

  try {
    if (orgId) {
      let accounts: Account[] = yield call(getAllAccounts, orgId);
      // console.log({ accounts });

      yield put(accountsSuccess(accounts));
    } else {
      throw new Error('accounts not found');
    }
  } catch (error) {
    console.log(error);
    const e = error as Error;
    yield put(fail(e));
    if (typeof error === 'object') {
      yield put(toastError(e?.message));
    }
  }
}

export function* watchCheckAccounts() {
  yield takeLatest(CHECK_ACCOUNTS, checkAccounts);
}
