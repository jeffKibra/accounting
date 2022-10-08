import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { UPDATE_SALES_RECEIPT } from '../../actions/salesReceiptsActions';
import { start, success, fail } from '../../slices/salesReceiptsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import {
  RootState,
  SalesReceiptForm,
  Org,
} from '../../../types';

interface UpdateData extends SalesReceiptForm {
  salesReceiptId: string;
}

function* updateSalesReceiptSaga(action: PayloadAction<UpdateData>) {
  yield put(start(UPDATE_SALES_RECEIPT));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;
  const { salesReceiptId, ...formData } = action.payload;

  async function update() {
    return httpsCallable(
      functions,
      'sales-salesReceipt-update'
    )({ orgId, salesReceiptId, formData });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Sales Receipt Sucessfully Updated!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateSalesReceipt() {
  yield takeLatest(UPDATE_SALES_RECEIPT, updateSalesReceiptSaga);
}
