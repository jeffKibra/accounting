import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { RiDeleteBin4Line, RiEdit2Line, RiEyeLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { useDeleteCarModel } from '../../../hooks';

import MenuOptions from '../../../components/ui/MenuOptions';

function CarModelOptions(props) {
  const { carModel, edit, view, deletion } = props;
  const { id: modelId } = carModel;

  const { details, isDeleted, resetCarModel } = useDeleteCarModel(carModel);

  useEffect(() => {
    if (isDeleted) {
      resetCarModel();
    }
  }, [isDeleted, resetCarModel]);

  const options = [
    ...(view
      ? [
          {
            name: 'View',
            icon: RiEyeLine,
            as: Link,
            to: `/car_models/${modelId}/view`,
          },
        ]
      : []),
    ...(edit
      ? [
          {
            name: 'Edit',
            icon: RiEdit2Line,
            as: Link,
            to: `/car_models/${modelId}/edit`,
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

CarModelOptions.propTypes = {
  carModel: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
};

export default CarModelOptions;
