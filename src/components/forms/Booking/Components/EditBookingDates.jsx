import { useState } from 'react';
// import PropTypes from 'prop-types';
//
import BookingDaysSelector from './BookingDaysSelector';
import Editable from './Editable';

//----------------------------------------------------------------
EditBookingDates.propTypes = {};

function EditBookingDates(props) {
  const [isEditing, setIsEditing] = useState(false);

  function toggleEditing() {
    setIsEditing(currentState => !currentState);
  }

  return (
    <Editable onEditToggle={toggleEditing} isEditing={isEditing}>
      <BookingDaysSelector isEditing={isEditing} colSpan={6} />
    </Editable>
  );
}

export default EditBookingDates;
