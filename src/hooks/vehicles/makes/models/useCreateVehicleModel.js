import { useEffect, useCallback, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
//
import { mutations } from 'gql';
import useToasts from '../../../useToasts';
import { VEHICLE_MODELS } from 'nav/routes';

//

function useCreateVehicleModel() {
  const [newBooking, { called, loading, reset, error }] = useMutation(
    mutations.vehicles.makes.models.CREATE_VEHICLE_MODEL
  );

  const [selectedMake, setSelectedMake] = useState('');

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
      navigate(`${VEHICLE_MODELS}?make=${selectedMake}`);
    }
  }, [success, toastSuccess, reset, navigate, selectedMake]);

  useEffect(() => {
    if (failed) {
      toastError(error?.message);
    }
  }, [failed, error, toastError]);

  const createVehicleModel = useCallback(
    formData => {
      //   console.log({ formData });
      const make = formData?.make || '';

      setSelectedMake(make);

      newBooking({
        variables: {
          formData,
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
