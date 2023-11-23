import { getDoc, doc } from 'firebase/firestore';
import { put, takeLatest, call, select } from 'redux-saga/effects';

import { db } from 'utils/firebase';

import { FETCH_ACCOUNT_TYPES } from '../../actions/accountTypesActions';
import {
  start,
  fail,
  accountTypesSuccess,
} from '../../slices/accountTypesSlice';
import { error as toastError } from '../../slices/toastSlice';

import { IAccountType, RootState } from 'types';

function* fetchAccountTypes() {
  yield put(start(FETCH_ACCOUNT_TYPES));

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function fetchList() {
    const docRef = doc(
      db,
      'organizations',
      orgId,
      'orgDetails',
      'accountTypes'
    );
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      throw new Error('account types not found!');
    }

    const mapValues = snap.data();

    const accountTypes = Object.entries(mapValues).map(([id, value]) => {
      return {
        ...value,
        id,
      };
    });

    console.log({ accountTypes });

    return accountTypes;
  }

  try {
    const accountTypes: IAccountType[] = yield call(fetchList);

    yield put(accountTypesSuccess(accountTypes));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchFetchAccountTypes() {
  yield takeLatest(FETCH_ACCOUNT_TYPES, fetchAccountTypes);
}
