import { forwardRef } from 'react';
import PropTypes from 'prop-types';

import ControlledDefaultDatePicker from './ControlledDefaultDatePicker';
import ControlledDatePickerWithScheduleLoader from './ControlledDatePickerWithScheduleLoader';

//----------------------------------------------------------------

const ControlledDatePicker = forwardRef((props, ref) => {
  // console.log({ props });
  const { loadSchedules, itemId, ...datePickerProps } = props;

  return loadSchedules && itemId ? (
    <ControlledDatePickerWithScheduleLoader
      itemId={itemId}
      ref={ref}
      {...datePickerProps}
    />
  ) : (
    <ControlledDefaultDatePicker ref={ref} {...datePickerProps} />
  );
});

ControlledDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(Date).isRequired,
  onBlur: PropTypes.func,
  loadSchedules: PropTypes.bool,
  itemId: PropTypes.string,
};

export default ControlledDatePicker;
