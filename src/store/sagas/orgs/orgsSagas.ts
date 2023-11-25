import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';

import { db } from '../../../utils/firebase';

import { start, orgsSuccess, orgSuccess, fail } from '../../slices/orgsSlice';
import { error as toastError } from '../../slices/toastSlice';
import { GET_ORGS, GET_ORG } from '../../actions/orgsActions';

import { IOrg } from '../../../types';

function* getOrg(action: PayloadAction<string>) {
  yield put(start(GET_ORG));
  const { payload: orgId } = action;
  async function fetchOrg() {
    const orgDoc = await getDoc(doc(db, 'organizations', orgId));
    return orgDoc.data();
  }

  try {
    const org: IOrg = yield call(fetchOrg);

    yield put(orgSuccess(org));
  } catch (error) {
    const err = error as Error;
    console.log(err);
    yield put(fail(err));
    yield put(toastError(err.message));
  }
}

export function* watchGetOrg() {
  yield takeLatest(GET_ORG, getOrg);
}

function* getOrgs() {
  yield put(start(GET_ORGS));

  async function fetchOrgs() {
    const q = query(
      collection(db, 'organizations'),
      where('status', 'in', ['onboarding', 'active', 'suspended'])
    );
    const orgsSnap = await getDocs(q);
    const orgs = orgsSnap.docs.map(orgDoc => {
      const orgData = {
        _id: orgDoc.id,
        ...orgDoc.data(),
      } as IOrg;

      return orgData;
    });

    return orgs;
  }

  try {
    const orgs: IOrg[] = yield call(fetchOrgs);

    yield put(orgsSuccess(orgs));
  } catch (error) {
    const err = error as Error;
    console.log(err);
    yield put(fail(err));
    yield put(toastError(err.message));
  }
}

export function* watchGetOrgs() {
  yield takeLatest(GET_ORGS, getOrgs);
}
