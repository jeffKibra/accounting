import { put, call, select, takeLatest } from 'redux-saga/effects';
import { runTransaction } from 'firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';

import { db } from '../../../utils/firebase';
import { deleteSalesReceipt } from '../../../utils/salesReceipts';
import { createDailySummary } from '../../../utils/summaries';

import { DELETE_SALES_RECEIPT } from '../../actions/salesReceiptsActions';
import { start, success, fail } from '../../slices/salesReceiptsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import ReceiptSale from 'utils/salesReceipts/receiptSale';

import { RootState, UserProfile, Org, Account } from '../../../types';

function* deleteSalesReceiptSaga(action: PayloadAction<string>) {
  yield put(start(DELETE_SALES_RECEIPT));
  const salesReceiptId = action.payload;
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const accounts: Account[] = yield select(
    (state: RootState) => state.accountsReducer.accounts
  );

  async function update() {
    /**
     * initialize by creating daily summary if none is available
     */
    await createDailySummary(orgId);
    /**
     * delete salesReceipt using a firestore transaction
     */
    await runTransaction(db, async transaction => {
      const receiptInstance = new ReceiptSale(transaction, {
        accounts,
        org,
        receiptData: null,
        salesReceiptId,
        userProfile,
      });

      await receiptInstance.deleteReceipt();
    });
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
