import { httpsCallable } from 'firebase/functions';
import { put, takeLatest, call, select } from 'redux-saga/effects';

import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from 'utils/firebase';

import { CREATE_MANUAL_JOURNAL } from '../../actions/manualJournalsActions';
import { start, fail, success } from '../../slices/manualJournalsSlice';
import {
  error as toastError,
  success as toastSuccess,
} from '../../slices/toastSlice';

import { IManualJournalForm, RootState } from 'types';

function* createManualJournal(action: PayloadAction<IManualJournalForm>) {
  yield put(start(CREATE_MANUAL_JOURNAL));
  console.log({ action });

  const formData = action.payload;

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  function create() {
    return httpsCallable(
      functions,
      'books-manualJournals-create'
    )({ orgId, formData });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess('Successfully created new journal!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateManualJournal() {
  yield takeLatest(CREATE_MANUAL_JOURNAL, createManualJournal);
}
