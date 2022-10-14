import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase/';

import { CREATE_VENDOR } from '../../actions/vendorsActions';
import { start, success, fail } from '../../slices/vendorsSlice';
import {
  success as toastSuccess,
  error as toastError,
} from '../../slices/toastSlice';

import { Org, RootState, VendorFormData } from '../../../types';

function* createVendorSaga(action: PayloadAction<VendorFormData>) {
  const { type, payload } = action;

  yield put(start(type));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  async function create() {
    return httpsCallable(
      functions,
      'purchase-vendor-create'
    )({ orgId, formData: payload });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess('Vendor added successfully!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateVendor() {
  yield takeLatest(CREATE_VENDOR, createVendorSaga);
}
