import { useEffect, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
// import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
//
import { useGetVehicleMake } from 'hooks';

//
// import ControlledSimpleSelect from 'components/ui/selects/ControlledSimpleSelect';
import SelectVehicleMakeInput from 'components/forms/VehicleModel/SelectVehicleMakeInput';
import VehicleModelTable from '../../../components/tables/VehicleModels';

function VehicleModelsList(props) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const selectedMake = searchParams.get('make');
  //
  // const preselectedMakeData=useMemo(()=>{
  //   if(preselectedMake)
  // }, [preselectedMake])
  //

  // console.log({ selectedVehicleMake, selectedVehicleMake });

  const { loading, refetch, error, vehicleMake } = useGetVehicleMake();
  // console.log({ loading, vehicleMake });

  const vehicleModels = useMemo(() => {
    let models = [];

    if (vehicleMake) {
      models = vehicleMake?.models || [];
    }

    return models;
  }, [vehicleMake]);

  useEffect(() => {
    if (selectedMake) {
      refetch(selectedMake);
    }
  }, [refetch, selectedMake]);

  function updateSelectedVehicleMake(data) {
    const makeName = data?.name || '';

    searchParams.set('make', makeName);
    const updatedParams = searchParams.toString();
    // console.log({ updatedParams });

    navigate(`${pathname}?${updatedParams}`, { replace: true });
  }

  function handleVehicleMakeChange(incomingValue) {
    // console.log({ incomingValue });

    return updateSelectedVehicleMake(incomingValue);
  }

  return (
    <Box w="full">
      <Box mb={3}>
        <SelectVehicleMakeInput
          onChange={handleVehicleMakeChange}
          value={selectedMake}
        />
      </Box>

      <VehicleModelTable
        loading={loading}
        error={error}
        vehicleModels={vehicleModels}
      />
    </Box>
  );
}

export default VehicleModelsList;
