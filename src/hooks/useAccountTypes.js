import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FETCH_ACCOUNT_TYPES } from 'store/actions/accountTypesActions';

const defaultConfig = { defaultFetch: true };

export default function useAccountTypes(config = defaultConfig) {
  const { defaultFetch } = config;
  console.log({ config });
  const dispatch = useDispatch();

  const { accountTypes, loading, error } = useSelector(
    state => state.accountTypesReducer
  );

  const errorMsg = error?.message || '';

  const fetchAccountTypes = useCallback(() => {
    dispatch({ type: FETCH_ACCOUNT_TYPES });
  }, [dispatch]);

  useEffect(() => {
    if (defaultFetch) {
      console.log('fetching account types by default');
      fetchAccountTypes();
    }
  }, [defaultFetch, fetchAccountTypes]);

  console.log({ accountTypes, loading, error });

  return { fetchAccountTypes, accountTypes, errorMsg, loading };
}
