import { httpsCallable } from 'firebase/functions';
import { put, takeLatest, call, select } from 'redux-saga/effects';

import { functions } from 'utils/firebase';

import { CHART_OF_ACCOUNTS_GET_LIST } from '../../actions/accountsActions';
import {
  fail,
  getList,
  getListSuccess,
} from '../../slices/chartOfAccountsSlice';
import { error as toastError } from '../../slices/toastSlice';

import { IAccount, RootState } from 'types';

function* getAccounts() {
  yield put(getList());

  const orgId: string = yield select(
    (state: RootState) => state.orgsReducer.org?.orgId
  );

  async function fetchList() {
    const result = await httpsCallable(
      functions,
      'books-accounts-list'
    )({ orgId });

    return result.data;
  }

  try {
    const accounts: IAccount[] = yield call(fetchList);

    yield put(getListSuccess(accounts));
  } catch (err) {
    const error = err as Error;
    console.log(error);
    yield put(fail(error));
    yield put(toastError(error.message));
  }
}

export function* watchChartOfAccountsGetList() {
  yield takeLatest(CHART_OF_ACCOUNTS_GET_LIST, getAccounts);
}
