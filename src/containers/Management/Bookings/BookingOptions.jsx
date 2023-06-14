import { useEffect } from 'react';
import {
  RiDeleteBin4Line,
  RiEdit2Line,
  RiEyeLine,
  RiDownloadCloud2Line,
  RiMoreFill,
} from 'react-icons/ri';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
} from '@chakra-ui/react';

import Dialog from 'components/ui/Dialog';

import { useDeleteBooking } from 'hooks';

import { generatePDF } from 'utils/invoices';

function BookingOptions(props) {
  console.log({ props });
  const { booking, edit, view, deletion, download } = props;
  const { id } = booking;
  const { details, isDeleted, resetBooking } = useDeleteBooking(booking);

  useEffect(() => {
    if (isDeleted) {
      resetBooking();
    }
  }, [isDeleted, resetBooking]);

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Table Options"
        icon={<RiMoreFill />}
        colorScheme="cyan"
        size="sm"
        title="options"
        // variant="outline"
      />
      <MenuList fontSize="md" lineHeight="6">
        {view ? (
          <MenuItem
            as={Link}
            to={`/sale/bookings/${id}/view`}
            icon={<RiEyeLine />}
          >
            View
          </MenuItem>
        ) : null}
        {edit ? (
          <MenuItem
            as={Link}
            to={`/sale/bookings/${id}/edit`}
            icon={<RiEdit2Line />}
          >
            Edit
          </MenuItem>
        ) : null}
        {deletion ? (
          <Dialog
            {...details}
            renderButton={onOpen => {
              return (
                <Box onClick={onOpen}>
                  <MenuItem icon={<RiDeleteBin4Line />}>Delete</MenuItem>
                </Box>
              );
            }}
          />
        ) : null}

        {download ? (
          <MenuItem
            onClick={() => generatePDF(booking)}
            icon={<RiDownloadCloud2Line />}
          >
            Download
          </MenuItem>
        ) : null}
      </MenuList>
    </Menu>
  );
}

BookingOptions.propTypes = {
  booking: PropTypes.object.isRequired,
  edit: PropTypes.bool,
  view: PropTypes.bool,
  deletion: PropTypes.bool,
};

export default BookingOptions;
