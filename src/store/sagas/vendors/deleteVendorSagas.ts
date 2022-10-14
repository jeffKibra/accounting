import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { DELETE_VENDOR } from '../../actions/vendorsActions';
import { start, success, fail } from '../../slices/vendorsSlice';
import {
  success as toastSuccess,
  error as toastError,
} from '../../slices/toastSlice';

import { RootState } from '../../../types';

function* deleteVendor(action: PayloadAction<string>) {
  yield put(start(DELETE_VENDOR));
  console.log({ action });

  const vendorId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function update() {
    return httpsCallable(
      functions,
      'purchase-vendor-delete'
    )({ orgId, vendorId });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('vendor Deleted successfully!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteVendor() {
  yield takeLatest(DELETE_VENDOR, deleteVendor);
}
