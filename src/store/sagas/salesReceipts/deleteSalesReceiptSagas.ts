import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { DELETE_SALES_RECEIPT } from '../../actions/salesReceiptsActions';
import { start, success, fail } from '../../slices/salesReceiptsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { RootState, Org } from '../../../types';

function* deleteSalesReceiptSaga(action: PayloadAction<string>) {
  yield put(start(DELETE_SALES_RECEIPT));
  const salesReceiptId = action.payload;
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  async function update() {
    return httpsCallable(
      functions,
      'sales-salesReceipt-delete'
    )({ orgId, salesReceiptId });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Sales Receipt Sucessfully DELETED!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteSalesReceipt() {
  yield takeLatest(DELETE_SALES_RECEIPT, deleteSalesReceiptSaga);
}
