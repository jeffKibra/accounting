import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { RiDeleteBin4Line, RiEdit2Line, RiEyeLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import useDeleteVehicle from '../../../hooks/useDeleteVehicle';

import MenuOptions from '../../../components/ui/MenuOptions';

function VehicleOptions(props) {
  const { vehicle, edit, view, deletion } = props;
  const { vehicleId } = vehicle;
  const { details, isDeleted, resetVehicle } = useDeleteVehicle(vehicle);

  useEffect(() => {
    if (isDeleted) {
      resetVehicle();
    }
  }, [isDeleted, resetVehicle]);

  const options = [
    ...(view
      ? [
          {
            name: 'View',
            icon: RiEyeLine,
            as: Link,
            to: `/vehicles/${vehicleId}/view`,
          },
        ]
      : []),
    ...(edit
      ? [
          {
            name: 'Edit',
            icon: RiEdit2Line,
            as: Link,
            to: `/vehicles/${vehicleId}/edit`,
          },
        ]
      : []),
    ...(deletion
      ? [
          {
            name: 'Delete',
            icon: RiDeleteBin4Line,
            dialogDetails: {
              ...details,
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <Box>
        <MenuOptions options={options} />
      </Box>
    </>
  );
}

VehicleOptions.propTypes = {
  vehicle: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
};

export default VehicleOptions;
