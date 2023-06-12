import { put, call, takeLatest, select } from 'redux-saga/effects';

import { httpsCallable } from 'firebase/functions';
import { PayloadAction } from '@reduxjs/toolkit';

import { functions } from '../../../utils/firebase';

import { CREATE_ITEM } from '../../actions/itemsActions';
import { start, success, fail } from '../../slices/itemsSlice';
import {
  success as toastSuccess,
  error as toastError,
} from '../../slices/toastSlice';

import { RootState, ItemFormData, Org } from '../../../types';

function* createItem(action: PayloadAction<ItemFormData>) {
  yield put(start(CREATE_ITEM));
  const { payload: data } = action;

  const org: Org = yield select((state: RootState) => state.orgsReducer.org);
  const { orgId } = org;
  // console.log({ data });

  async function create() {
    return httpsCallable(functions, 'items-create')({ orgId, itemData: data });
  }

  try {
    yield call(create);

    yield put(success());
    yield put(toastSuccess('Successfully created Item!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCreateItem() {
  yield takeLatest(CREATE_ITEM, createItem);
}
