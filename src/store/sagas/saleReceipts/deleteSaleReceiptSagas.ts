import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { DELETE_SALE_RECEIPT } from '../../actions/saleReceiptsActions';
import { start, success, fail } from '../../slices/saleReceiptsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { RootState, Org } from '../../../types';

function* deleteSaleReceiptSaga(action: PayloadAction<string>) {
  yield put(start(DELETE_SALE_RECEIPT));
  const saleReceiptId = action.payload;
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  async function update() {
    return httpsCallable(
      functions,
      'sale-saleReceipt-delete'
    )({ orgId, saleReceiptId });
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

export function* watchDeleteSaleReceipt() {
  yield takeLatest(DELETE_SALE_RECEIPT, deleteSaleReceiptSaga);
}
