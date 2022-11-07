import { httpsCallable } from 'firebase/functions';
import { put, takeLatest, call, select } from 'redux-saga/effects';

import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from 'utils/firebase';

import { DELETE_ACCOUNT } from '../../actions/accountsActions';
import { start, fail, success } from '../../slices/accountsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { RootState } from 'types';

function* deleteAccount(action: PayloadAction<string>) {
  yield put(start(DELETE_ACCOUNT));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  const accountId = action.payload;

  function markAsDeleted() {
    return httpsCallable(
      functions,
      'books-accounts-delete'
    )({ orgId, accountId });
  }

  try {
    yield call(markAsDeleted);

    yield put(success());
    yield put(toastSuccess('Successfully deleted account!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteAccount() {
  yield takeLatest(DELETE_ACCOUNT, deleteAccount);
}
