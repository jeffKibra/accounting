import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { UPDATE_OPENING_BALANCE } from '../../actions/customersActions';
import { start, success, fail } from '../../slices/customersSlice';
import {
  success as toastSuccess,
  error as toastError,
} from '../../slices/toastSlice';

import { RootState, Org } from '../../../types';

function* updateOpeningBalanceSaga(
  action: PayloadAction<{ customerId: string; amount: number }>
) {
  console.log({ action });
  yield put(start(UPDATE_OPENING_BALANCE));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  const { amount, customerId } = action.payload;
  console.log('sagas', { amount, customerId });

  async function update() {
    return httpsCallable(
      functions,
      'sales-customer-openingBalance-update'
    )({
      orgId,
      customerId,
      amount,
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Action successful!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateCustomerOpeningBalance() {
  yield takeLatest(UPDATE_OPENING_BALANCE, updateOpeningBalanceSaga);
}
