import { httpsCallable } from 'firebase/functions';
import { put, takeLatest, call, select } from 'redux-saga/effects';

import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from 'utils/firebase';

import { UPDATE_ACCOUNT } from '../../actions/accountsActions';
import { start, fail, success } from '../../slices/chartOfAccountsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { AccountFormData, RootState } from 'types';

interface UpdateData extends AccountFormData {
  accountId: string;
}

function* updateAccount(action: PayloadAction<UpdateData>) {
  yield put(start(UPDATE_ACCOUNT));
  // console.log({ action });

  const { accountId, ...formData } = action.payload;

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  function update() {
    return httpsCallable(
      functions,
      'books-accounts-update'
    )({ orgId, accountId, formData });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Successfully updated account!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateAccount() {
  yield takeLatest(UPDATE_ACCOUNT, updateAccount);
}
