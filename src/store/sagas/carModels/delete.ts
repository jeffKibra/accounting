import { put, call, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { doc, updateDoc, deleteField } from 'firebase/firestore';

import { dbCollections } from '../../../utils/firebase';

import { DELETE_CAR_MODEL } from '../../actions/carModelsActions';
import { start, success, fail } from '../../slices/carModelsSlice';
import {
  success as toastSuccess,
  error as toastError,
} from '../../slices/toastSlice';

import { RootState } from '../../../types';

function* deleteCarModel(action: PayloadAction<string>) {
  yield put(start(DELETE_CAR_MODEL));
  const modelId = action.payload;
  // console.log({ modelId });

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function update() {
    const collectionRef = dbCollections(orgId).orgDetails;
    const carModelsDocRef = doc(collectionRef, 'carModels');

    updateDoc(carModelsDocRef, {
      [modelId]: deleteField(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Car Model successfully deleted!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteCarModel() {
  yield takeLatest(DELETE_CAR_MODEL, deleteCarModel);
}
