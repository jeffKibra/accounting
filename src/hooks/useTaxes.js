import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GET_TAXES } from 'store/actions/taxesActions';

function useTaxes() {
  const dispatch = useDispatch();
  const taxes = useSelector(state => state?.taxesReducer?.taxes);

  const fetchTaxes = useCallback(() => {
    dispatch({ type: GET_TAXES });
  }, [dispatch]);

  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  const isLoading = !taxes;

  return { fetchTaxes, isLoading, taxes };
}

export default useTaxes;
