import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import BookingDaysSelector from './BookingDaysSelector';
import Editable from './Editable';

//----------------------------------------------------------------
EditBookingDates.propTypes = {
  loading: PropTypes.bool,
};

function EditBookingDates(props) {
  const { loading } = props;

  const [isEditing, setIsEditing] = useState(false);

  const { watch } = useFormContext();

  const item = watch('item');
  const itemId = item?.itemId;

  function toggleEditing() {
    setIsEditing(currentState => !currentState);
  }

  return (
    <Editable onEditToggle={toggleEditing} isEditing={isEditing}>
      <BookingDaysSelector
        loadSchedules
        loading={loading}
        itemId={itemId}
        isEditing={isEditing}
        colSpan={6}
      />
    </Editable>
  );
}

export default EditBookingDates;
