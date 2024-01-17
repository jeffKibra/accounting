import { useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
//
import { mutations } from 'gql';
import useToasts from '../useToasts';

//

function useCreateVehicleModel() {
  const [newBooking, { called, loading, reset, error }] = useMutation(
    mutations.vehicles.makes.models.CREATE_VEHICLE_MODEL
  );

  const navigate = useNavigate();

  const { error: toastError, success: toastSuccess } = useToasts();

  const success = called && !loading && !error;
  const failed = called && !loading && Boolean(error);

  //   console.log({ loading });
  //   console.log({ success, failed, data });

  useEffect(() => {
    if (success) {
      toastSuccess('Vehicle Model created successfully!');
      //
      reset();
      navigate(`/vehicles/makes`);
    }
  }, [success, toastSuccess, reset, navigate]);

  useEffect(() => {
    if (failed) {
      toastError(error?.message);
    }
  }, [failed, error, toastError]);

  const createVehicleModel = useCallback(
    formData => {
      //   console.log({ formData });
      newBooking({
        variables: {
          formData: formData,
        },
      });
    },
    [newBooking]
  );

  return {
    loading,
    error,
    reset,
    success,
    failed,
    createVehicleModel,
  };
}

export default useCreateVehicleModel;
