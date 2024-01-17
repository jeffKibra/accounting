import { useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
//
import { mutations } from 'gql';
import useToasts from '../useToasts';
import useGetVehicleModel from './useGetVehicleModel';

//

function useUpdateVehicleModel(makeId, modelId) {
  const [modifyBooking, { called, loading: updating, reset, error }] =
    useMutation(mutations.vehicles.makes.models.UPDATE_VEHICLE_MODEL);

  const { loading, vehicleModel } = useGetVehicleModel(makeId, modelId);

  const navigate = useNavigate();

  const { error: toastError, success: toastSuccess } = useToasts();

  const success = called && !updating && !error;
  const failed = called && !updating && Boolean(error);

  //   console.log({ loading });
  //   console.log({ success, failed, data });

  useEffect(() => {
    if (success) {
      toastSuccess('vehicle model updated successfully!');
      //
      reset();
      //updated make view page
      navigate(`/vehicles/makes/${makeId}`);
    }
  }, [success, toastSuccess, reset, navigate, makeId]);

  useEffect(() => {
    if (failed) {
      toastError(error?.message);
    }
  }, [failed, error, toastError]);

  // const currentSelectedVehicleId = booking?.vehicle?._id;

  const updateVehicleModel = useCallback(
    formData => {
      return modifyBooking({
        variables: {
          makeId,
          id: modelId,
          formData,
        },
      });
    },
    [
      makeId,
      modelId,
      modifyBooking,
      // currentSelectedVehicleId
    ]
  );

  return {
    updating,
    error,
    reset,
    success,
    failed,
    updateVehicleModel,
    //fetching params
    loading,
    vehicleModel,
  };
}

export default useUpdateVehicleModel;