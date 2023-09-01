import { httpsCallable } from 'firebase/functions';
import { put, takeLatest, call, select } from 'redux-saga/effects';

import { functions } from 'utils/firebase';

import { GET_ACCOUNTS } from '../../actions/accountsActions';
import {
  getList,
  getListSuccess,
  fail,
} from '../../slices/chartOfAccountsSlice';
import { error as toastError } from '../../slices/toastSlice';

import { AccountFromDb, RootState } from 'types';

function* listAccounts() {
  yield put(getList());

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

    yield put(getListSuccess(accounts));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchListAccounts() {
  yield takeLatest(GET_ACCOUNTS, listAccounts);
}
