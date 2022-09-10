import { put, call, select, takeLatest } from 'redux-saga/effects';
import {
  doc,
  collection,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';

import { db } from '../../../utils/firebase';
import { createCustomer } from '../../../utils/customers';

import { CREATE_CUSTOMER } from '../../actions/customersActions';
import { start, success, fail } from '../../slices/customersSlice';
import {
  success as toastSuccess,
  error as toastError,
} from '../../slices/toastSlice';

import Summary from 'utils/summaries/summary';
import { paymentModes } from '../../../constants';

import {
  CustomerFormData,
  RootState,
  Org,
  Account,
  UserProfile,
} from '../../../types';

function* createCustomerSaga(action: PayloadAction<CustomerFormData>) {
  yield put(start(CREATE_CUSTOMER));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const accounts: Account[] = yield select(
    (state: RootState) => state.accountsReducer.accounts
  );
  const userId = userProfile.uid;

  // console.log({ data });

  const summaryData = {
    invoices: 0,
    deletedInvoices: 0,
    payments: 0,
    deletedPayments: 0,
    salesReceipts: 0,
    deletedSalesReceipts: 0,
    invoicesTotal: 0,
    paymentsTotal: 0,
    salesreceiptsTotal: 0,
    paymentModes: Object.keys(paymentModes).reduce((modes, key) => {
      return { ...modes, [key]: 0 };
    }, {}),
    accounts: Object.keys(accounts).reduce((accountsSummary, key) => {
      return {
        ...accountsSummary,
        [key]: 0,
      };
    }, {}),
    createdAt: serverTimestamp(),
    createdBy: userId,
    modifiedAt: serverTimestamp(),
    modifiedBy: userId,
  };

  async function create() {
    const newDocRef = doc(collection(db, 'organizations', orgId, 'customers'));
    const customerId = newDocRef.id;

    //create customer summary first
    const customerSummaryRef = Summary.createCustomerRef(orgId, customerId);
    await setDoc(customerSummaryRef, summaryData, { merge: true });

    const customerData = { ...action.payload };

    await runTransaction(db, async transaction => {
      await createCustomer(
        transaction,
        org,
        userProfile,
        accounts,
        customerId,
        customerData
      );
    });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess('Customer added successfully!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateCustomer() {
  yield takeLatest(CREATE_CUSTOMER, createCustomerSaga);
}
