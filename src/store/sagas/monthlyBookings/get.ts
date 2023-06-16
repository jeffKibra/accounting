import { put, call, select, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
//
import {
  GET_MONTH_BOOKINGS,
  GET_MONTHLY_BOOKINGS,
} from '../../actions/monthlyBookings';
//
import { start, success, fail } from '../../slices/monthlyBookings';
import { error as toastError } from '../../slices/toastSlice';
//
//
import { Bookings } from 'utils/bookings';
//
import { IMonthBookings, IMonthlyBookings, RootState } from 'types';

function* getMonthBookings(action: PayloadAction<string>) {
  const monthId = action.payload;

  yield put(start(monthId));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer?.org?.orgId
  );
  // console.log({ monthId, orgId });

  try {
    const bookings: IMonthBookings = yield call(
      Bookings.getMonthBookings,
      orgId,
      monthId
    );
    // console.log({ bookings });

    yield put(success({ [monthId]: bookings }));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(
      toastError(`Error fetching month ${monthId} bookings: ${error.message} `)
    );
  }
}

export function* watchGetMonthBookings() {
  yield takeLatest(GET_MONTH_BOOKINGS, getMonthBookings);
}

function* getMonthlyBookings(action: PayloadAction<string[]>) {
  const months = action.payload;
  // console.log('fetching monthly bookings', months);

  yield put(start(months));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer?.org?.orgId
  );
  // console.log({ months, orgId });

  try {
    const monthlyBookings: IMonthlyBookings = yield call(
      Bookings.getMonthlyBookings,
      orgId,
      months
    );
    // console.log({ monthlyBookings });

    yield put(success(monthlyBookings));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(toastError(`Error fetching months bookings: ${error.message} `));
  }
}

export function* watchGetMonthlyBookings() {
  yield takeLatest(GET_MONTHLY_BOOKINGS, getMonthlyBookings);
}
