import { put, call, select, takeLatest } from 'redux-saga/effects';
import { runTransaction } from 'firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';

import { db } from '../../../utils/firebase';
import { InvoiceSale } from '../../../utils/invoices';
import { createDailySummary } from '../../../utils/summaries';

import { UPDATE_INVOICE } from '../../actions/invoicesActions';
import { start, success, fail } from '../../slices/invoicesSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import {
  RootState,
  InvoiceFormData,
  UserProfile,
  Account,
  Org,
} from '../../../types';

interface UpdateData extends InvoiceFormData {
  invoiceId: string;
}

function* updateInvoiceSaga(action: PayloadAction<UpdateData>) {
  yield put(start(UPDATE_INVOICE));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const accounts: Account[] = yield select(
    (state: RootState) => state.accountsReducer.accounts
  );

  async function update() {
    /**
     * itialize by creating the daily summary if none is available
     */
    await createDailySummary(org.orgId);
    /**
     * update invoice using a transaction
     */
    await runTransaction(db, async transaction => {
      /**
       * first part of update, fetch all relevant data
       * data reading
       */
      const { invoiceId, ...formData } = action.payload;
      const invoiceInstance = new InvoiceSale(transaction, {
        invoiceId,
        accounts,
        org,
        userId: userProfile.uid,
        transactionType: 'invoice',
      });
      await invoiceInstance.update(formData);
      // const { currentInvoice, entriesToDelete, entriesToUpdate, newAccounts } =
      //   await fetchInvoiceUpdateData(transaction, orgId, invoiceId, formData);
      // /**
      //  * last part of update function
      //  * data writing
      //  */
      // updateInvoice(
      //   transaction,
      //   orgId,
      //   userProfile,
      //   accounts,
      //   entriesToUpdate,
      //   entriesToDelete,
      //   newAccounts,
      //   currentInvoice,
      //   { ...currentInvoice, ...formData }
      // );
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
