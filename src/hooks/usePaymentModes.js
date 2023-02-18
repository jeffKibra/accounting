import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GET_PAYMENT_MODES } from 'store/actions/paymentModesActions';

export default function usePaymentModes() {
  const dispatch = useDispatch();
  const { loading, paymentModes, error } = useSelector(
    state => state.paymentModesReducer || {}
  );

  const fetchPaymentModes = useCallback(() => {
    dispatch({ type: GET_PAYMENT_MODES });
  }, [dispatch]);

  useEffect(() => {
    fetchPaymentModes();
  }, [fetchPaymentModes]);

  return {
    fetchPaymentModes,
    loading,
    paymentModes,
    error,
  };
}
