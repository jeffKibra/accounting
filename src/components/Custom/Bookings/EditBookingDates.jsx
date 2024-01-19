import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
//
import BookingDaysSelector from './BookingDaysSelector';
import Editable from './Editable';

//----------------------------------------------------------------
EditBookingDates.propTypes = {
  loading: PropTypes.bool,
  currentBookingDetails: PropTypes.object,
};

function EditBookingDates(props) {
  const { loading, currentBookingDetails } = props;

  const [isEditing, setIsEditing] = useState(false);

  const { watch } = useFormContext();

  const item = watch('item');
  const itemId = item?.itemId;
  //
  let preselectedDates = currentBookingDetails?.selectedDates || [];
  const currentSelectedItemId = currentBookingDetails?.item?.itemId || '';

  preselectedDates = currentSelectedItemId === itemId ? preselectedDates : [];

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
        preselectedDates={preselectedDates}
      />
    </Editable>
  );
}

export default EditBookingDates;
