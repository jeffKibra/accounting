import { put, call, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { httpsCallable } from 'firebase/functions';

import { functions } from '../../../utils/firebase';

import { CREATE_INVOICE } from '../../actions/invoicesActions';
import { start, success, fail } from '../../slices/invoicesSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { RootState, Org, InvoiceFormData } from '../../../types';

function* createInvoiceSaga(action: PayloadAction<InvoiceFormData>) {
  yield put(start(CREATE_INVOICE));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  console.log({ action });

  const invoice = action.payload;

  async function create() {
    return httpsCallable(
      functions,
      'sales-invoices-create'
    )({ orgId, formData: invoice });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess('Invoice created Sucessfully!'));
  } catch (err) {
    console.log(err);
    const error = err as Error;
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateInvoice() {
  yield takeLatest(CREATE_INVOICE, createInvoiceSaga);
}
