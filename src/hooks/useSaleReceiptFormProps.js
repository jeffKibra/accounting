import { useCallback, useMemo } from 'react';

import usePaymentModes from './usePaymentModes';
import useAccounts from './useAccounts';
import useGetSalesProps from './useGetSalesProps';

export default function useSaleReceiptFormProps() {
  const {
    paymentModes,
    loading: loadingPaymentModes,
    fetchPaymentModes,
  } = usePaymentModes();
  const { accounts, loading: loadingAccounts, fetchAccounts } = useAccounts();
  const {
    customers,
    items,
    taxes,
    loading: loadingSaleProps,
  } = useGetSalesProps();

  const refresh = useCallback(() => {
    fetchAccounts();
    fetchPaymentModes();
  }, [fetchPaymentModes, fetchAccounts]);

  const loading = loadingAccounts || loadingPaymentModes || loadingSaleProps;

  const paymentAccounts = useMemo(() => {
    if (!Array.isArray(accounts)) {
      return [];
    }

    return accounts.filter(account => {
      const {
        accountType: { id },
        tags,
      } = account;
      const index = tags.findIndex(tag => tag === 'receivable');

      return id === 'cash' && index > -1;
    });
  }, [accounts]);

  return {
    paymentModes,
    accounts: paymentAccounts,
    loading,
    refresh,
    customers,
    items,
    taxes,
  };
}
