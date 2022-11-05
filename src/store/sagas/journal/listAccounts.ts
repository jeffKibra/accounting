import { httpsCallable } from 'firebase/functions';
import { put, takeLatest, call, select } from 'redux-saga/effects';

import { functions } from 'utils/firebase';

import { FETCH_ACCOUNTS } from '../../actions/journalActions';
import { start, fail, accountsSuccess } from '../../slices/journalSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { AccountFromDb, RootState } from 'types';

function* listAccounts() {
  yield put(start(FETCH_ACCOUNTS));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  function fetchList() {
    return httpsCallable(functions, 'books-chartOfAccounts-list')({ orgId });
  }

  try {
    const accounts: AccountFromDb[] = yield call(fetchList);

    yield put(accountsSuccess(accounts));
    yield put(toastSuccess('Successfully created new account!'));
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
