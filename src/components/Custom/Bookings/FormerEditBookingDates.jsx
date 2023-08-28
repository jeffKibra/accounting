import { Flex, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
//
import CustomModal from 'components/ui/CustomModal';
//
import BookingDaysSelector from './BookingDaysSelector';

//----------------------------------------------------------------
EditBookingDates.propTypes = {
  children: PropTypes.node.isRequired,
};

function EditBookingDates(props) {
  const { children } = props;

  return (
    <CustomModal
      title="Edit Booking Dates"
      closeOnOverlayClick
      renderTrigger={onOpen => {
        return children(onOpen);
      }}
      renderContent={() => {
        return <BookingDaysSelector useInlineCalenders />;
      }}
      renderFooter={onClose => {
        return (
          <Flex>
            <Button onClick={onClose}>close</Button>
          </Flex>
        );
      }}
    />
  );
}

export default EditBookingDates;
