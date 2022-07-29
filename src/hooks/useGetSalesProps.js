import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { GET_ITEMS } from "store/actions/itemsActions";
import { GET_CUSTOMERS } from "store/actions/customersActions";
import { GET_PAYMENT_TERMS } from "store/actions/paymentTermsActions";

export default function useGetSalesProps() {
  const dispatch = useDispatch();
  let {
    loading: loadingItems,
    items,
    action: itemsAction,
  } = useSelector((state) => state.itemsReducer);
  loadingItems = loadingItems && itemsAction === GET_ITEMS;

  let {
    loading: loadingCustomers,
    customers,
    action: customersAction,
  } = useSelector((state) => state.customersReducer);
  loadingCustomers = loadingCustomers && customersAction === GET_CUSTOMERS;

  let {
    loading: loadingPaymentTerms,
    paymentTerms,
    action: ptAction,
  } = useSelector((state) => state.paymentTermsReducer);
  loadingPaymentTerms = loadingPaymentTerms && ptAction === GET_PAYMENT_TERMS;

  const loading = loadingItems || loadingCustomers || loadingPaymentTerms;

  useEffect(() => {
    function getItems() {
      dispatch({ type: GET_ITEMS });
    }
    function getCustomers() {
      dispatch({ type: GET_CUSTOMERS });
    }
    function getPaymentTerms() {
      dispatch({ type: GET_PAYMENT_TERMS });
    }

    getItems();
    getCustomers();
    getPaymentTerms();
  }, [dispatch]);

  return {
    loading,
    items,
    customers,
    paymentTerms,
  };
}
