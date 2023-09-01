import { put, call, takeLatest, select } from 'redux-saga/effects';

import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';

import { dbCollections } from '../../../utils/firebase';

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
  console.log({ data });

  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;

  async function create() {
    const collectionRef = dbCollections(orgId).orgDetails;
    const carModelsDocRef = doc(collectionRef, 'carModels');

    const fieldId = doc(collectionRef).id;
    console.log({ fieldId });

    await updateDoc(carModelsDocRef, {
      [fieldId]: {
        ...data,
        id: fieldId,
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
      },
    });
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
