import { forwardRef } from 'react';
import { Input } from '@chakra-ui/react';
import PropTypes from 'prop-types';

import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

const DateInput = forwardRef((props, ref) => {
  const { onClick, onChange, value, ...extraProps } = props;

  return (
    <Input
      {...extraProps}
      onClick={onClick}
      onChange={onChange}
      value={value}
      ref={ref}
    />
  );
});

//----------------------------------------------------------------

const ControlledDatePicker = forwardRef((props, ref) => {
  console.log({ props });
  const { name, onChange, value, onBlur, ...extraProps } = props;

  return (
    <DatePicker
      {...extraProps}
      onBlur={onBlur}
      ref={ref}
      selected={value}
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
  value: PropTypes.instanceOf(Date).isRequired,
  onBlur: PropTypes.func,
};

export default ControlledDatePicker;
