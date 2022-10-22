import { put, call, select, takeLatest } from 'redux-saga/effects';
import { getDoc, doc } from 'firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';

import { db } from '../../../utils/firebase';
import { GET_SUMMARY } from '../../actions/summariesActions';
import { start, summarySuccess, fail } from '../../slices/summariesSlice';
import { error as toastError } from '../../slices/toastSlice';

import { RootState, DailySummary } from '../../../types';

function* getSummary(action: PayloadAction<string>) {
  yield put(start(action.type));
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get(summaryId: string) {
    const mainSummaryRef = doc(
      db,
      'organizations',
      orgId,
      'summaries',
      summaryId
    );

    const snap = await getDoc(mainSummaryRef);
    if (!snap.exists()) {
      return {};
    }

    return {
      ...snap.data(),
      summaryId: snap.id,
    };
  }

  try {
    const summaryId = action.payload;
    const summary: DailySummary = yield call(get, summaryId);
    console.log({ summary });

    yield put(summarySuccess({ summaryId, summaryData: summary }));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetSummary() {
  yield takeLatest(GET_SUMMARY, getSummary);
}
