import { put, call, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { httpsCallable } from 'firebase/functions';

import { functions } from '../../../utils/firebase';

import { CREATE_CUSTOMER } from '../../actions/customersActions';
import { start, success, fail } from '../../slices/customersSlice';
import {
  success as toastSuccess,
  error as toastError,
} from '../../slices/toastSlice';

import { IContactForm, RootState, Org } from '../../../types';

function* createCustomerSaga(action: PayloadAction<IContactForm>) {
  yield put(start(CREATE_CUSTOMER));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  // console.log({ data });
  const formData: IContactForm = {
    ...action.payload,
    contactType: 'customer',
  };

  async function create() {
    return httpsCallable(
      functions,
      'sale-customer-create'
    )({ orgId, formData });
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
