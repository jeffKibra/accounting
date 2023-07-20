import { put, takeLatest, select, call } from 'redux-saga/effects';
import { doc, getDoc } from 'firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';

//
import { GET_CAR_MODELS, GET_CAR_MODEL } from '../../actions/carModelsActions';
import { dbCollections } from '../../../utils/firebase';
//
import {
  start,
  carModelsSuccess,
  carModelSuccess,
  fail,
} from '../../slices/carModelsSlice';
import { error as toastError } from '../../slices/toastSlice';

//
import { ICarModel, RootState } from 'types';
//
type ICarModels = Record<string, ICarModel>;

async function getAllModels(orgId: string) {
  const orgDetailsCollectionRef = dbCollections(orgId).orgDetails;
  const carModelsRef = doc(orgDetailsCollectionRef, 'carModels');

  const snap = await getDoc(carModelsRef);

  if (!snap.exists) {
    throw new Error('Car models not found!');
  }

  return {
    ...(snap.data() as ICarModels),
  };
}

function* getCarModel(action: PayloadAction<string>) {
  yield put(start(GET_CAR_MODEL));

  const modelId = action.payload;
  // console.log({ modelId });

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    const allModels = await getAllModels(orgId);
    // console.log({ allModels });
    const modelData = allModels[modelId];
    // console.log({ modelData });

    return {
      ...modelData,
      id: modelId,
    };
  }

  try {
    const carModel: ICarModel = yield call(get);

    yield put(carModelSuccess(carModel));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCarModel() {
  yield takeLatest(GET_CAR_MODEL, getCarModel);
}

function* getCarModels() {
  yield put(start(GET_CAR_MODELS));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer?.org?.orgId
  );

  try {
    const carModels: ICarModels = yield call(getAllModels, orgId);
    // console.log({ carModels });

    yield put(carModelsSuccess(carModels));
  } catch (err) {
    const error = err as Error;
    console.error(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetCarModels() {
  yield takeLatest(GET_CAR_MODELS, getCarModels);
}
