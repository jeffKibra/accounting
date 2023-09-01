import { put, call, select, takeLatest } from 'redux-saga/effects';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { PayloadAction } from '@reduxjs/toolkit';

import { db } from '../../../utils/firebase';

import { UPDATE_CUSTOMER } from '../../actions/customersActions';
import { start, success, fail } from '../../slices/customersSlice';
import {
  success as toastSuccess,
  error as toastError,
} from '../../slices/toastSlice';

import { IContact, RootState, UserProfile } from '../../../types';

interface IUpdateData extends IContact {
  customerId: string;
}

function* updateCustomer(action: PayloadAction<IUpdateData>) {
  yield put(start(UPDATE_CUSTOMER));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );
  const userProfile: UserProfile = yield select(
    (state: RootState) => state.authReducer.userProfile
  );
  const { uid } = userProfile;

  const { customerId, ...rest } = action.payload;
  // console.log({ action });
  // console.log({ customerId });

  async function update() {
    /**
     * update customer data
     */
    await updateDoc(doc(db, 'organizations', orgId, 'contacts', customerId), {
      ...rest,
      modifiedBy: uid,
      modifiedAt: serverTimestamp(),
    });
  }

  try {
    yield call(update);

    yield put(success());
    yield put(toastSuccess('Customer UPDATED successfully!'));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchUpdateCustomer() {
  yield takeLatest(UPDATE_CUSTOMER, updateCustomer);
}
