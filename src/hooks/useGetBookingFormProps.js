import { useCallback } from 'react';

import usePaymentModes from './usePaymentModes';
// import useAccounts from './useAccounts';
import useGetSalesProps from './useGetSalesProps';

export default function useGetBookingFormProps() {
  const {
    paymentModes,
    loading: loadingPaymentModes,
    fetchPaymentModes,
  } = usePaymentModes();
  // const { accounts, loading: loadingAccounts, fetchAccounts } = useAccounts();

  const {
    customers,
    // items,
    taxes,
    loading: loadingSaleProps,
    paymentTerms,
  } = useGetSalesProps();

  const refresh = useCallback(() => {
    // fetchAccounts();
    fetchPaymentModes();
  }, [
    fetchPaymentModes,
    //  fetchAccounts
  ]);

  const loading = loadingPaymentModes || loadingSaleProps;
  // || loadingAccounts;

  // const paymentAccounts = useMemo(() => {
  //   if (!Array.isArray(accounts)) {
  //     return [];
  //   }

  //   return accounts.filter(account => {
  //     const {
  //       accountType: { id },
  //       tags,
  //     } = account;
  //     const index = tags.findIndex(tag => tag === 'receivable');

  //     return id === 'cash' && index > -1;
  //   });
  // }, [accounts]);

  return {
    paymentModes,
    paymentTerms,
    // accounts: paymentAccounts,
    loading,
    refresh,
    customers,
    // items,
    taxes,
  };
}
