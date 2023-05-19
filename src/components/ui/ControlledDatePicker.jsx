import { forwardRef } from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'react-datepicker';

import DateInput from './DateInput';

import 'react-datepicker/dist/react-datepicker.css';

//----------------------------------------------------------------

const ControlledDatePicker = forwardRef((props, ref) => {
  // console.log({ props });
  const { name, onChange, selected, onBlur, ...extraProps } = props;

  return (
    <DatePicker
      {...extraProps}
      onBlur={onBlur}
      ref={ref}
      selected={selected}
      onChange={onChange}
      customInput={<DateInput name={name} />}
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
    />
  );
});

ControlledDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.instanceOf(Date).isRequired,
  onBlur: PropTypes.func,
};

export default ControlledDatePicker;
