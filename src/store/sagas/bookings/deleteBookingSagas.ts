import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { DELETE_BOOKING } from '../../actions/bookingsActions';
import { start, success, fail } from '../../slices/bookingsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { RootState, Org } from '../../../types';

function* deleteBookingSaga(action: PayloadAction<string>) {
  yield put(start(action.type));
  const bookingId = action.payload;
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  async function update() {
    return httpsCallable(
      functions,
      'sales-bookings-delete'
    )({ orgId, bookingId });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Booking Sucessfully Deleted!'));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteBooking() {
  yield takeLatest(DELETE_BOOKING, deleteBookingSaga);
}
