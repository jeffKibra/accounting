import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { RiDeleteBin4Line, RiEdit2Line, RiEyeLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import MenuOptions from '../../../components/ui/MenuOptions';

function VehicleModelOptions(props) {
  const { vehicleModel, edit, view, deletion } = props;
  const { _id: modelId, make } = vehicleModel;

  // const { details, isDeleted, resetvehicleModel } = useDeletevehicleModel(vehicleModel);

  const options = [
    ...(view
      ? [
          {
            name: 'View',
            icon: RiEyeLine,
            as: Link,
            to: `/vehicle_models/${make}/${modelId}/view`,
          },
        ]
      : []),
    ...(edit
      ? [
          {
            name: 'Edit',
            icon: RiEdit2Line,
            as: Link,
            to: `/vehicle_models/${make}/${modelId}/edit`,
          },
        ]
      : []),
    // ...(deletion
    //   ? [
    //       {
    //         name: 'Delete',
    //         icon: RiDeleteBin4Line,
    //         dialogDetails: {
    //           ...details,
    //         },
    //       },
    //     ]
    //   : []),
  ];

  return (
    <>
      <Box>
        <MenuOptions options={options} />
      </Box>
    </>
  );
}

VehicleModelOptions.propTypes = {
  vehicleModel: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
};

export default VehicleModelOptions;
