import { put, call, select, takeLatest } from 'redux-saga/effects';
import { runTransaction } from 'firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';

import { db } from '../../../utils/firebase';
import {
  // createSalesReceipt,
  createReceiptId,
} from '../../../utils/salesReceipts';
import { createDailySummary } from '../../../utils/summaries';

import { CREATE_SALES_RECEIPT } from '../../actions/salesReceiptsActions';
import { start, success, fail } from '../../slices/salesReceiptsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import {
  SalesReceiptForm,
  RootState,
  UserProfile,
  Account,
  Org,
} from '../../../types';

function* createSalesReceiptSaga(action: PayloadAction<SalesReceiptForm>) {
  yield put(start(CREATE_SALES_RECEIPT));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const accounts: Account[] = yield select(
    (state: RootState) => state.accountsReducer.accounts
  );
  // console.log({ data });

  async function create() {
    /**
     * create daily summary before proceeding
     */
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
