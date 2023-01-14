import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  GET_CUSTOMER_UNPAID_INVOICES,
  GET_PAYMENT_INVOICES_TO_EDIT,
} from 'store/actions/invoicesActions';

export default function useCustomerInvoices() {
  const dispatch = useDispatch();

  const invoicesReducer = useSelector(state => state.invoicesReducer);
  // console.log({ invoicesReducer });
  const { loading, action, invoices, error } = invoicesReducer;
  // console.log({ error });

  const loadingInvoices =
    loading &&
    (action === GET_CUSTOMER_UNPAID_INVOICES ||
      action === GET_PAYMENT_INVOICES_TO_EDIT);

  const getInvoices = useCallback(
    customerId => {
      // console.log('fetching invoices');
      dispatch({ type: GET_CUSTOMER_UNPAID_INVOICES, payload: customerId });
    },
    [dispatch]
  );

  const getInvoicesToEdit = useCallback(
    (customerId, paymentId) => {
      // console.log('fetch invoices to edit');
      dispatch({
        type: GET_PAYMENT_INVOICES_TO_EDIT,
        payload: { customerId, paymentId },
      });
    },
    [dispatch]
  );

  return {
    getInvoices,
    getInvoicesToEdit,
    loading: loadingInvoices,
    action,
    invoices,
    error,
  };
}
