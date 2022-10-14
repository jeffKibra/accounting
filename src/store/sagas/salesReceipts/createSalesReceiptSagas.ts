import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { CREATE_SALES_RECEIPT } from '../../actions/salesReceiptsActions';
import { start, success, fail } from '../../slices/salesReceiptsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { SalesReceiptForm, RootState, Org } from '../../../types';

function* createSalesReceiptSaga(action: PayloadAction<SalesReceiptForm>) {
  yield put(start(CREATE_SALES_RECEIPT));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  // console.log({ data });

  async function create() {
    return httpsCallable(
      functions,
      'sale-salesReceipt-create'
    )({ orgId, formData: action.payload });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess('Sales Receipt created Sucessfully!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateSalesReceipt() {
  yield takeLatest(CREATE_SALES_RECEIPT, createSalesReceiptSaga);
}
