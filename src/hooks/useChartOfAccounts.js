import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { reset } from 'store/slices/chartOfAccountsSlice';
import { CHART_OF_ACCOUNTS_GET_LIST } from 'store/actions/accountsActions';

//------------------------------------------------------------------------------

export default function useChartOfAccounts() {
  const dispatch = useDispatch();
  const {
    isModified,
    loading: loadingAccounts,
    action,
    accounts,
    error,
  } = useSelector(state => state.chartOfAccountsReducer);

  const fetchChartOfAccountsList = useCallback(() => {
    return dispatch({ type: CHART_OF_ACCOUNTS_GET_LIST });
  }, [dispatch]);

  // console.log({ isModified });

  useEffect(() => {
    if (isModified) {
      dispatch(reset());
      //fetch chart of accountsList
      fetchChartOfAccountsList();
    }
  }, [isModified, dispatch, fetchChartOfAccountsList]);

  const loading = loadingAccounts && action === CHART_OF_ACCOUNTS_GET_LIST;

  return { loading, fetchChartOfAccountsList, accounts, error };
}
