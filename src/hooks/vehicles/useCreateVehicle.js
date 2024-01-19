import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';

//
import { mutations } from 'gql';
//hooks
import useToasts from '../useToasts';
import useItemFormProps from '../useItemFormProps';
//routes
import { ITEMS } from 'nav/routes';

export default function useCreateVehicle() {
  const [newVehicle, { loading, error, called, reset, data }] = useMutation(
    mutations.vehicles.CREATE_VEHICLE
  );

  const success = called && !loading && !error;
  const failed = called && !loading && Boolean(error);
  //   console.log({ success, failed });

  //   console.log({ error });

  const { taxes, loading: loadingProps } = useItemFormProps();

  const { error: toastError, success: toastSuccess } = useToasts();

  const navigate = useNavigate();

  const createdVehicleId = data?.createVehicle || '';
  // console.log({ data, createdVehicleId });

  useEffect(() => {
    console.log({ success });
    if (success) {
      toastSuccess('Vehicle created successfully!');
      //
      reset();
      //wait before navigating
      navigate(`${ITEMS}/${createdVehicleId}/view`);
    }
  }, [reset, navigate, toastSuccess, success, createdVehicleId]);

  useEffect(() => {
    if (failed) {
      console.log(error);
      toastError(error.message);
    }
  }, [error, failed, toastError]);

  const createVehicle = useCallback(
    formData => {
      console.log({ formData });

      return newVehicle({
        variables: { formData },
        // refetchQueries: [
        //   {
        //     query: 'SearchVehicles',
        //     // fetchPolicy:''
        //   },
        // ],
      });
    },
    [newVehicle]
  );

  return {
    createVehicle,
    loading,
    loadingProps,
    taxes,
  };
}
