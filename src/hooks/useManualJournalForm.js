import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GET_TAXES } from 'store/actions/taxesActions';

function useTaxes() {
  const dispatch = useDispatch();
  const state = useSelector(state => state);
  console.log({ state });

  const fetchTaxes = useCallback(() => {
    dispatch(GET_TAXES);
  }, [dispatch]);

  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  return { fetchTaxes };
}

export default useTaxes;
