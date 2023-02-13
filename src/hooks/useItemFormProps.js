import { useCallback, useMemo } from 'react';

import { useTaxes, useAccounts } from '.';

export default function useItemFormProps() {
  const { taxes, isLoading, fetchTaxes } = useTaxes();
  const { accounts, loading: loadingAccounts, fetchAccounts } = useAccounts();

  const refresh = useCallback(() => {
    fetchTaxes();
    fetchAccounts();
  }, [fetchTaxes, fetchAccounts]);

  const incomeAccounts = useMemo(() => {
    if (Array.isArray(accounts)) {
      return accounts?.filter(({ accountType: { id } }) => id === 'income');
    } else {
      return null;
    }
  }, [accounts]);

  const loading = isLoading || loadingAccounts;

  //   console.log({ loading, accounts, taxes });

  return {
    taxes,
    accounts: incomeAccounts,
    loading,
    refresh,
  };
}
