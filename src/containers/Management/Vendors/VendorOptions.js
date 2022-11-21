import { useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { RiDeleteBin4Line, RiEdit2Line, RiEyeLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { useDeleteVendor } from '../../../hooks';

import MenuOptions from '../../../components/ui/MenuOptions';

function VendorOptions(props) {
  const { vendor, edit, view, deletion } = props;
  const { vendorId } = vendor;
  const { details, isDeleted, resetVendor } = useDeleteVendor(vendor);

  useEffect(() => {
    if (isDeleted) {
      resetVendor();
    }
  }, [isDeleted, resetVendor]);

  const options = [
    ...(view
      ? [
          {
            name: 'View',
            icon: RiEyeLine,
            as: Link,
            to: `/purchase/vendors/${vendorId}/view`,
          },
        ]
      : []),
    ...(edit
      ? [
          {
            name: 'Edit',
            icon: RiEdit2Line,
            as: Link,
            to: `/purchase/vendors/${vendorId}/edit`,
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

VendorOptions.propTypes = {
  vendor: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
};

export default VendorOptions;
