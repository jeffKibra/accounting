import { put, call, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { doc, updateDoc } from 'firebase/firestore';

import { dbCollections } from '../../../utils/firebase';

import { UPDATE_CAR_MODEL } from '../../actions/carModelsActions';
import { start, success, fail } from '../../slices/carModelsSlice';
import {
  success as toastSuccess,
  error as toastError,
} from '../../slices/toastSlice';

import { ICarModelForm, RootState } from '../../../types';

interface UpdateData extends Partial<ICarModelForm> {
  modelId: string;
}

function* updateCarModel(action: PayloadAction<UpdateData>) {
  yield put(start(UPDATE_CAR_MODEL));
  console.log({ action });

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function update() {
    const { modelId, ...formData } = action.payload;

    const collectionRef = dbCollections(orgId).orgDetails;
    const carModelsDocRef = doc(collectionRef, 'carModels');

    await updateDoc(carModelsDocRef, {
      [modelId]: {
        ...formData,
        id: modelId,
      },
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Car Model successfully updated!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateCarModel() {
  yield takeLatest(UPDATE_CAR_MODEL, updateCarModel);
}
