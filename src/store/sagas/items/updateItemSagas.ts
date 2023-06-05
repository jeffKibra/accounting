import { put, call, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { httpsCallable } from 'firebase/functions';

import { functions } from '../../../utils/firebase';

import { UPDATE_ITEM, DELETE_ITEM } from '../../actions/itemsActions';
import { start, success, fail } from '../../slices/itemsSlice';
import {
  success as toastSuccess,
  error as toastError,
} from '../../slices/toastSlice';

import { ItemFormData, RootState } from '../../../types';

interface UpdateData extends Partial<ItemFormData> {
  itemId: string;
}

function* updateItem(action: PayloadAction<UpdateData>) {
  yield put(start(UPDATE_ITEM));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function update() {
    const { itemId, ...formData } = action.payload;
    return httpsCallable(
      functions,
      'item-update'
    )({ orgId, itemId, data: formData });
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

export function* watchUpdateItem() {
  yield takeLatest(UPDATE_ITEM, updateItem);
}

function* deleteItem(action: PayloadAction<string>) {
  yield put(start(DELETE_ITEM));
  const itemId = action.payload;

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function update() {
    return httpsCallable(functions, 'item-delete')({ orgId, itemId });
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

export function* watchDeleteItem() {
  yield takeLatest(DELETE_ITEM, deleteItem);
}
