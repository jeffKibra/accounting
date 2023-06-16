import { put, call, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { httpsCallable } from 'firebase/functions';

import { functions } from '../../../utils/firebase';

import { CREATE_BOOKING } from '../../actions/bookingsActions';
import { start, success, fail } from '../../slices/bookingsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { RootState, Org, IBookingForm } from '../../../types';

function* createBookingSaga(action: PayloadAction<IBookingForm>) {
  yield put(start(CREATE_BOOKING));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  // console.log({ action });

  const booking = action.payload;

  async function create() {
    return httpsCallable(
      functions,
      'sales-bookings-create'
    )({ orgId, formData: booking });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess('booking created Sucessfully!'));
  } catch (err) {
    console.error(err);
    const error = err as Error;
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateBooking() {
  yield takeLatest(CREATE_BOOKING, createBookingSaga);
}
