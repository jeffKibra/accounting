import { useState } from 'react';
import { Stack } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
// import PropTypes from 'prop-types';
//
//
import Editable from './Editable';
import TransferAmount from './TransferAmount';
import BookingRate from './BookingRate';
import { NumberDisplay } from './CustomDisplays';

EditBookingPricing.propTypes = {};

export default function EditBookingPricing(props) {
  const [isEditing, setIsEditing] = useState(false);

  const { watch } = useFormContext();

  const bookingTotal = watch('bookingTotal');
  // const selectedDates = watch('selectedDates');
  const daysCount = watch('daysCount');

  function toggleEditing() {
    setIsEditing(currentState => !currentState);
  }

  return (
    <Editable onEditToggle={toggleEditing} isEditing={isEditing}>
      <Stack>
        <TransferAmount isEditing={isEditing} />

        <BookingRate isEditing={isEditing} />

        <NumberDisplay title="Days Count" value={daysCount || 0} />
        <NumberDisplay
          title="Booking Total"
          value={Number(bookingTotal || 0).toLocaleString()}
        />
      </Stack>
    </Editable>
  );
}
