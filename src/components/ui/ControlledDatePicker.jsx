import { forwardRef } from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'react-datepicker';

import DateInput from './DateInput';

import 'react-datepicker/dist/react-datepicker.css';

//----------------------------------------------------------------

const ControlledDatePicker = forwardRef((props, ref) => {
  // console.log({ props });
  const { name, onChange, value, onBlur, ...extraProps } = props;
  console.log({ extraProps });

  return (
    <DatePicker
      onBlur={onBlur}
      ref={ref}
      selected={value}
      onChange={onChange}
      customInput={<DateInput name={name} />}
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
      dateFormat="dd-MMM-yyyy"
      showIcon
      {...extraProps}
    />
  );
});

ControlledDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.instanceOf(Date).isRequired,
  onBlur: PropTypes.func,
};

export default ControlledDatePicker;
