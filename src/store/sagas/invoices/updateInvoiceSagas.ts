import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { UPDATE_INVOICE } from '../../actions/invoicesActions';
import { start, success, fail } from '../../slices/invoicesSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { RootState, InvoiceFormData, Org } from '../../../types';

interface UpdateData extends InvoiceFormData {
  invoiceId: string;
}

function* updateInvoiceSaga(action: PayloadAction<UpdateData>) {
  yield put(start(UPDATE_INVOICE));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  const {
    payload: { invoiceId, ...formData },
  } = action;

  async function update() {
    return httpsCallable(
      functions,
      'sale-invoice-update'
    )({
      orgId,
      invoiceId,
      formData,
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Invoice updated Sucessfully!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateInvoice() {
  yield takeLatest(UPDATE_INVOICE, updateInvoiceSaga);
}
