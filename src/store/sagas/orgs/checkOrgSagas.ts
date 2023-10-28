import { put, call, takeLatest, select } from 'redux-saga/effects';

import { CHECK_ORG } from '../../actions/orgsActions';
import { start, orgSuccess, fail } from '../../slices/orgsSlice';
import { error as toastError } from '../../slices/toastSlice';

import { getOrg } from './createOrgSagas';

import { RootState, UserProfile, Org } from '../../../types';

function* checkOrg() {
  try {
    yield put(start(CHECK_ORG));
    const userProfile: UserProfile = yield select(
      (state: RootState) => state.authReducer.userProfile
    );

    // console.log({ userProfile });
    const { uid } = userProfile;

    const org: Org | null = uid ? yield call(getOrg, uid) : null;
    // console.log({ org });

    const orgId = org?.orgId || '';
    // console.log({ orgId });
    localStorage.setItem('orgId', orgId);

    yield put(orgSuccess(org));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchCheckOrg() {
  yield takeLatest(CHECK_ORG, checkOrg);
}
