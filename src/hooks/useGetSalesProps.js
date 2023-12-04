import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import { GET_ITEMS } from 'store/actions/itemsActions';
import { GET_CUSTOMERS } from 'store/actions/customersActions';
// import { GET_PAYMENT_TERMS } from 'store/actions/paymentTermsActions';
// import { GET_TAXES } from 'store/actions/taxesActions';
//
import useTaxes from './useTaxes';

export default function useGetSalesProps() {
  const dispatch = useDispatch();

  const org = useSelector(state => state.orgsReducer?.org || {});
  const paymentTerms = org?.paymentTerms || [];
  // console.log({ paymentTerms });

  const { taxes, isLoading: loadingTaxes } = useTaxes();

  const loading = loadingTaxes;

  useEffect(() => {
    // function getItems() {
    //   dispatch({ type: GET_ITEMS });
    // }
    // function getPaymentTerms() {
    //   dispatch({ type: GET_PAYMENT_TERMS });
    // }
    // function getTaxes() {
    //   dispatch({ type: GET_TAXES });
    // }

    // getItems();
    // getPaymentTerms();
    // getTaxes();
  }, [dispatch]);

  return {
    loading,
    // items,
    paymentTerms,
    taxes,
  };
}
