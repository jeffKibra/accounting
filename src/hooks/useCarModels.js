import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { GET_CAR_MODELS } from 'store/actions/carModelsActions';

export default function useCarModels() {
  const dispatch = useDispatch();

  const carModelsReducer = useSelector(state => state?.carModelsReducer || {});
  // console.log({ carModelsReducer });
  const { loading, action, carModels, carMakes, carTypes, error } =
    carModelsReducer;
  // console.log({ error });

  const loadingModels = loading && action === GET_CAR_MODELS;

  const getModels = useCallback(() => {
    // console.log('fetching carModels');
    dispatch({ type: GET_CAR_MODELS });
  }, [dispatch]);

  useEffect(() => {
    getModels();
  }, [getModels]);

  return {
    getModels,
    loading: loadingModels,
    action,
    carModels,
    carMakes,
    carTypes,
    error,
  };
}
