import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { GET_ACCOUNTS } from 'store/actions/accountsActions';

//------------------------------------------------------------------------------
/**
 * @typedef {Object} UseAccountsOptions
 * @property {Function} isModifiedCb
 */

export default function useAccounts() {
  const dispatch = useDispatch();
  const {
    loading: loadingAccounts,
    accounts,
    error,
  } = useSelector(state => state.accountsReducer);

  const fetchAccounts = useCallback(() => {
    return dispatch({ type: GET_ACCOUNTS });
  }, [dispatch]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const loading = loadingAccounts || !accounts;
  // console.log({ loading, loadingAccounts, accounts });

  return { loading, fetchAccounts, accounts, error };
}
