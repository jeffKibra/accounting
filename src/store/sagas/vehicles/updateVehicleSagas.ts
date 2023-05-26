import { put, call, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { httpsCallable } from 'firebase/functions';

import { functions } from '../../../utils/firebase';

import { UPDATE_VEHICLE, DELETE_VEHICLE } from '../../actions/vehiclesActions';
import { start, success, fail } from '../../slices/vehiclesSlice';
import {
  success as toastSuccess,
  error as toastError,
} from '../../slices/toastSlice';

import { VehicleFormData, RootState } from '../../../types';

interface UpdateData extends Partial<VehicleFormData> {
  vehicleId: string;
}

function* updateVehicle(action: PayloadAction<UpdateData>) {
  yield put(start(UPDATE_VEHICLE));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function update() {
    const { vehicleId, ...formData } = action.payload;
    return httpsCallable(
      functions,
      'vehicle-update'
    )({ orgId, vehicleId, data: formData });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Item successfully updated!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateVehicle() {
  yield takeLatest(UPDATE_VEHICLE, updateVehicle);
}

function* deleteVehicle(action: PayloadAction<string>) {
  yield put(start(DELETE_VEHICLE));
  const vehicleId = action.payload;

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function update() {
    return httpsCallable(functions, 'vehicle-delete')({ orgId, vehicleId });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Item successfully deleted!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchDeleteVehicle() {
  yield takeLatest(DELETE_VEHICLE, deleteVehicle);
}
