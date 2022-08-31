import { put, call, select, takeLatest } from 'redux-saga/effects';
import { runTransaction } from 'firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';

import { db } from '../../../utils/firebase';
import {
  createInvoice,
  createInvoiceId,
  InvoiceSale,
} from '../../../utils/invoices';
import { createDailySummary } from '../../../utils/summaries';

import { CREATE_INVOICE } from '../../actions/invoicesActions';
import { start, success, fail } from '../../slices/invoicesSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import {
  RootState,
  Org,
  UserProfile,
  Account,
  InvoiceFormData,
} from '../../../types';

function* createInvoiceSaga(action: PayloadAction<InvoiceFormData>) {
  yield put(start(CREATE_INVOICE));
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
    await createDailySummary(orgId);
    /**
     * create invoice using a firestore transaction
     */
    await runTransaction(db, async transaction => {
      /**
       * generate the invoice slug
       */
      const invoiceId = await createInvoiceId(transaction, orgId);
      /**
       * create invoice
       */
      const invoiceInstance = new InvoiceSale(transaction, {
        accounts,
        invoiceId,
        incomingData: action.payload,
        org,
        transactionType: 'invoice',
        userProfile,
      });
      invoiceInstance.create();
    });
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
