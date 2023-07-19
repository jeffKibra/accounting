import { put, call, takeLatest, select } from 'redux-saga/effects';

import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { CREATE_CAR_MODEL } from '../../actions/carModelsActions';
import { start, success, fail } from '../../slices/carModelsSlice';
import {
  success as toastSuccess,
  error as toastError,
} from '../../slices/toastSlice';

import { RootState, ICarModelForm, Org } from '../../../types';

function* createCarModel(action: PayloadAction<ICarModelForm>) {
  yield put(start(CREATE_CAR_MODEL));
  const { payload: data } = action;

  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;
  console.log({ data });

  async function create() {
    return httpsCallable(
      functions,
      'items-car_models'
    )({ orgId, carModelData: data });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess('Successfully created Car Model!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateCarModel() {
  yield takeLatest(CREATE_CAR_MODEL, createCarModel);
}
