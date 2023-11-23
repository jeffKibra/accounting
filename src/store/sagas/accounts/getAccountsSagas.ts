import { put, call, takeLatest, select } from 'redux-saga/effects';
// import { accounts } from "../../../constants";
import { PayloadAction } from '@reduxjs/toolkit';

import { GET_ACCOUNTS } from '../../actions/accountsActions';
import { getList, getListSuccess, fail } from '../../slices/accountsSlice';
import { error as toastError } from '../../slices/toastSlice';

import { getAllAccounts } from '../../../utils/accounts';

import { RootState, IAccount } from '../../../types';

function* getAccounts(action: PayloadAction<string>) {
  yield put(getList());

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId || ''
  );

  try {
    if (orgId) {
      let accounts: IAccount[] = yield call(getAllAccounts, orgId);
      // console.log({ accounts });

      yield put(getListSuccess(accounts));
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

export function* watchGetAccounts() {
  yield takeLatest(GET_ACCOUNTS, getAccounts);
}
