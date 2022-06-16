import { forwardRef } from "react";
import { Input } from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";
import PropTypes from "prop-types";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const DateInput = forwardRef((props, ref) => {
  const { onClick, onChange, value } = props;

  return (
    <Input onClick={onClick} onChange={onChange} value={value} ref={ref} />
  );
});

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
        required: { value: required, message: "*Required!" },
      }}
      render={({ field: { name, onBlur, onChange, value, ref } }) => {
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
