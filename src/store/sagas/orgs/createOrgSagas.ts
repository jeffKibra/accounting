import { collection, limit, where, getDocs, query } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { put, call, takeLatest, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import { db, functions } from '../../../utils/firebase';

import { start, success, fail } from '../../slices/orgsSlice';
import { CREATE_ORG } from '../../actions/orgsActions';
import {
  success as toastSuccess,
  error as toastError,
} from '../../slices/toastSlice';

import { OrgFormData, Org, UserProfile } from '../../../types';

export function getOrg(userId: string) {
  // console.log('getting org', userId);

  const q = query(
    collection(db, 'organizations'),
    where('createdBy', '==', userId),
    where('status', 'in', [0, 1]),
    limit(1)
  );

  return getDocs(q).then(snap => {
    if (snap.empty) {
      return null;
    }

    const orgDoc = snap.docs[0];

    return {
      ...orgDoc.data(),
      orgId: orgDoc.id,
    };
  });
}

function* createOrg(action: PayloadAction<OrgFormData>) {
  yield put(start(CREATE_ORG));
  console.log({ payload: action.payload });

  const userProfile: UserProfile = yield select(
    state => state.authReducer.userProfile
  );
  const userId = userProfile.uid;

  async function saveData() {
    await httpsCallable(functions, 'orgs-create')({ ...action.payload });

    const org = await getOrg(userId);

    return org;
  }

  try {
    const org: Org = yield call(saveData);
    // console.log({ org });

    yield put(success(org));
    yield put(toastSuccess('Campany successfully created!'));
  } catch (error) {
    const err = error as Error;
    console.log(err);
    yield put(fail(err));
    yield put(toastError(err.message));
  }
}

export function* watchCreateOrg() {
  yield takeLatest(CREATE_ORG, createOrg);
}
