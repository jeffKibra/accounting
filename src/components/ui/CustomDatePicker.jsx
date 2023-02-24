import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

import ControlledDatePicker from './ControlledDatePicker';

function CustomDatePicker(props) {
  const { defaultDate, name, required } = props;
  const defaultValue = new Date(defaultDate || Date.now());
  // console.log({ defaultDate, defaultValue });

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        required: { value: required, message: '*Required!' },
      }}
      render={({ field: { name, onBlur, onChange, value, ref } }) => {
        return (
          <ControlledDatePicker
            name={name}
            onBlur={onBlur}
            ref={ref}
            value={value}
            onChange={onChange}
          />
        );
      }}
    />
  );
}

CustomDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  defaultDate: PropTypes.string,
};

export default CustomDatePicker;
