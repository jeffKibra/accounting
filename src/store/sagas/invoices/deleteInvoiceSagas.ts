import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { DELETE_INVOICE } from '../../actions/invoicesActions';
import { start, success, fail } from '../../slices/invoicesSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { RootState, Org } from '../../../types';

function* deleteInvoiceSaga(action: PayloadAction<string>) {
  yield put(start(DELETE_INVOICE));
  const invoiceId = action.payload;
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  async function update() {
    return httpsCallable(
      functions,
      'sale-invoice-delete'
    )({ orgId, invoiceId });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Invoice Sucessfully Deleted!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteInvoice() {
  yield takeLatest(DELETE_INVOICE, deleteInvoiceSaga);
}
