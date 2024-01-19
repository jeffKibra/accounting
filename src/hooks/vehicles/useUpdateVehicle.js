import { useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
//
import { mutations } from 'gql';
import useToasts from '../useToasts';
import useGetVehicle from './useGetVehicle';

function useUpdateVehicle(vehicleId) {
  const [modifyVehicle, { called, loading: updating, reset, error }] =
    useMutation(mutations.vehicles.UPDATE_VEHICLE);

  const { loading, vehicle } = useGetVehicle(vehicleId);

  const navigate = useNavigate();

  const { error: toastError, success: toastSuccess } = useToasts();

  const success = called && !updating && !error;
  const failed = called && !updating && Boolean(error);

  //   console.log({ loading });
  //   console.log({ success, failed, data });

  useEffect(() => {
    if (success) {
      toastSuccess('Vehicle updated successfully!');
      //
      reset();
      //wait before redirecting
      navigate(`/items/${vehicleId}/view`);
    }
  }, [success, toastSuccess, reset, navigate, vehicleId]);

  useEffect(() => {
    if (failed) {
      toastError(error?.message);
    }
  }, [failed, error, toastError]);

  const updateVehicle = useCallback(
    formData => {
      //   console.log({ formData });
      modifyVehicle({
        variables: {
          id: vehicleId,
          formData,
        },
      });
    },
    [vehicleId, modifyVehicle]
  );

  return {
    updating,
    error,
    reset,
    success,
    failed,
    updateVehicle,
    //fetch params
    loading,
    vehicle,
  };
}

export default useUpdateVehicle;
