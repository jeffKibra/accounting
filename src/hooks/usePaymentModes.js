// import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';

// import { GET_PAYMENT_MODES } from 'store/actions/paymentModesActions';

export default function usePaymentModes() {
  // const dispatch = useDispatch();
  const org = useSelector(state => state.orgsReducer?.org || {});
  const paymentModes = org?.paymentModes || [];

  // const fetchPaymentModes = useCallback(() => {
  //   dispatch({ type: GET_PAYMENT_MODES });
  // }, [dispatch]);

  // useEffect(() => {
  //   fetchPaymentModes();
  // }, [fetchPaymentModes]);

  return {
    // fetchPaymentModes,
    // loading,
    paymentModes,
    // error,
  };
}
