import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { UPDATE_BOOKING } from '../../actions/bookingsActions';
import { start, success, fail } from '../../slices/bookingsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { RootState, IBookingForm, Org } from '../../../types';

interface UpdateData extends IBookingForm {
  bookingId: string;
}

function* updateBookingSaga(action: PayloadAction<UpdateData>) {
  yield put(start(UPDATE_BOOKING));
  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  const {
    payload: { bookingId, ...formData },
  } = action;

  async function update() {
    return httpsCallable(
      functions,
      'sales-bookings-update'
    )({
      orgId,
      bookingId,
      formData,
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('booking updated Sucessfully!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateBooking() {
  yield takeLatest(UPDATE_BOOKING, updateBookingSaga);
}
