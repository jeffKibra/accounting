import { put, call, select, takeLatest } from 'redux-saga/effects';
import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';
import { GET_SUMMARY } from '../../actions/summariesActions';
import { start, summarySuccess, fail } from '../../slices/summariesSlice';
import { error as toastError } from '../../slices/toastSlice';

import { RootState, DailySummary } from '../../../types';

function* getMainSummary(action: PayloadAction<string>) {
  yield put(start(action.type));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?._id
  );

  async function get() {
    const result = await httpsCallable(
      functions,
      'dashboard-org-main'
    )({ orgId });

    return result.data;
  }

  try {
    const summary: DailySummary = yield call(get);
    console.log({ summary });

    yield put(summarySuccess({ summaryId: 'main', summaryData: summary }));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetMainSummary() {
  yield takeLatest(GET_SUMMARY, getMainSummary);
}
