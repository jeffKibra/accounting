import { httpsCallable } from 'firebase/functions';
import { put, takeLatest, call, select } from 'redux-saga/effects';

import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from 'utils/firebase';

import { CREATE_ACCOUNT } from '../../actions/journalActions';
import { start, fail, success } from '../../slices/journalSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { AccountFormData, RootState } from 'types';

function* createAccount(action: PayloadAction<AccountFormData>) {
  yield put(start(CREATE_ACCOUNT));

  const formData = action.payload;

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  function create() {
    return httpsCallable(
      functions,
      'books-chartOfAccounts-create'
    )({ orgId, formData });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess('Successfully created new account!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateAccount() {
  yield takeLatest(CREATE_ACCOUNT, createAccount);
}
