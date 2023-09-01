import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { CREATE_SALE_RECEIPT } from '../../actions/saleReceiptsActions';
import { start, success, fail } from '../../slices/saleReceiptsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { SaleReceiptForm, RootState, Org } from '../../../types';

function* createSaleReceiptSaga(action: PayloadAction<SaleReceiptForm>) {
  yield put(start(CREATE_SALE_RECEIPT));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  // console.log({ data });

  async function create() {
    return httpsCallable(
      functions,
      'sales-saleReceipts-create'
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

export function* watchCreateSaleReceipt() {
  yield takeLatest(CREATE_SALE_RECEIPT, createSaleReceiptSaga);
}
