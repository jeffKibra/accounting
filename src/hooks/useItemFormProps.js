import { useCallback } from 'react';

import { useTaxes } from '.';

export default function useItemFormProps() {
  const { taxes, isLoading, fetchTaxes } = useTaxes();
  // const { accounts, loading: loadingAccounts, fetchAccounts } = useAccounts();

  const refresh = useCallback(() => {
    fetchTaxes();
    // fetchAccounts();
  }, [fetchTaxes]);

  // const incomeAccounts = useMemo(() => {
  //   if (Array.isArray(accounts)) {
  //     return accounts?.filter(({ accountType: { id } }) => id === 'income');
  //   } else {
  //     return null;
  //   }
  // }, [accounts]);

  // const loading = isLoading || loadingAccounts;
  const loading = isLoading;

  //   console.log({ loading, accounts, taxes });

  return {
    taxes,
    // accounts: incomeAccounts,
    loading,
    refresh,
  };
}
