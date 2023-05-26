import { put, call, takeLatest, select } from 'redux-saga/effects';
import {
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from 'firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';

import { db, dbCollections } from '../../../utils/firebase';

import { GET_VEHICLES, GET_VEHICLE } from '../../actions/vehiclesActions';
import {
  start,
  vehicleSuccess,
  vehiclesSuccess,
  fail,
} from '../../slices/vehiclesSlice';
import { error as toastError } from '../../slices/toastSlice';

import { RootState, Vehicle } from '../../../types';

function* getVehicles() {
  yield put(start(GET_VEHICLES));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  // const {orgId} = org;

  async function get() {
    const vehiclesCollection = dbCollections(orgId).vehicles;
    const q = query(
      vehiclesCollection,
      orderBy('createdAt', 'desc'),
      where('status', '==', 0)
    );
    const snap = await getDocs(q);
    const vehicles = snap.docs.map(itemDoc => {
      return {
        ...itemDoc.data(),
        vehicleId: itemDoc.id,
      };
    });

    return vehicles;
  }

  try {
    const vehicles: Vehicle[] = yield call(get);
    // console.log({ vehicles });

    yield put(vehiclesSuccess(vehicles));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetVehicles() {
  yield takeLatest(GET_VEHICLES, getVehicles);
}

function* getVehicle(action: PayloadAction<string>) {
  yield put(start(GET_VEHICLE));
  const vehicleId = action.payload;
  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function get() {
    const itemDoc = await getDoc(
      doc(db, 'organizations', orgId, 'vehicles', vehicleId)
    );

    if (!itemDoc.exists) {
      throw new Error('item not found!');
    }

    return {
      ...itemDoc.data(),
      vehicleId: itemDoc.id,
    };
  }

  try {
    const item: Vehicle = yield call(get);

    yield put(vehicleSuccess(item));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchGetVehicle() {
  yield takeLatest(GET_VEHICLE, getVehicle);
}
