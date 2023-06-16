import { Controller, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

import ControlledDatePicker from './ControlledDatePicker';

function CustomDatePicker(props) {
  const { defaultDate, name, required, controllerProps, ...datePickerProps } =
    props;
  const defaultValue = new Date(defaultDate || Date.now());
  // console.log({ defaultDate, defaultValue });

  let rules = {};
  if (controllerProps && typeof controllerProps === 'object') {
    rules = controllerProps?.rules || {};
    // delete controllerProps.rules;
  }

  // console.log(name, { controllerProps, rules });

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        required: { value: required, message: '*Required!' },
        ...rules,
      }}
      {...controllerProps}
      render={({ field: { name, onBlur, onChange, value, ref } }) => {
        return (
          <ControlledDatePicker
            name={name}
            onBlur={onBlur}
            ref={ref}
            selected={value}
            onChange={onChange}
            {...datePickerProps}
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
  controllerProps: PropTypes.object,
};

export default CustomDatePicker;
