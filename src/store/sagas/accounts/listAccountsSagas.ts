import { httpsCallable } from 'firebase/functions';
import { put, takeLatest, call, select } from 'redux-saga/effects';

import { functions } from 'utils/firebase';

import { FETCH_ACCOUNTS } from '../../actions/accountsActions';
import {
  start,
  fail,
  chartOfAccountsSuccess,
  resetList,
} from '../../slices/accountsSlice';
import { error as toastError } from '../../slices/toastSlice';

import { AccountFromDb, RootState } from 'types';

function* listAccounts() {
  yield put(start(FETCH_ACCOUNTS));
  yield put(resetList());

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function fetchList() {
    const result = await httpsCallable(
      functions,
      'books-accounts-list'
    )({ orgId });

    return result.data;
  }

  try {
    const accounts: AccountFromDb[] = yield call(fetchList);

    yield put(chartOfAccountsSuccess(accounts));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchListAccounts() {
  yield takeLatest(FETCH_ACCOUNTS, listAccounts);
}
