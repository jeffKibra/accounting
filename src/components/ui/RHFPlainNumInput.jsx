import { useFormContext, Controller } from "react-hook-form";
import PropTypes from "prop-types";

import ControlledNumInput from "./ControlledNumInput";

function RHFPlainNumInput(props) {
  const {
    name,
    rules,
    mode,
    isDisabled,
    isReadOnly,
    onChange,
    onBlur,
    updateValueOnBlur,
    min,
    max,
  } = props;

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      shouldUnregister={true}
      rules={rules}
      render={({
        field: { value, onBlur: onInputBlur, onChange: onInputChange },
      }) => {
        function getValueOnBlur(inputValue) {
          //update value
          if (updateValueOnBlur) {
            onInputChange(inputValue);
          }
          //trigger blur event for the input
          onInputBlur();
          //call external handle blur event function
          onBlur(inputValue);
        }

        function getValueOnChange(inputValue) {
          //update value
          onInputChange(inputValue);
          //call external handle onChange event function
          onChange();
        }

        return (
          <ControlledNumInput
            min={min}
            defaultValue={+value}
            getValueOnBlur={getValueOnBlur}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            {...(mode === "onBlur" ? { getValueOnBlur } : { getValueOnChange })}
            {...(max ? { max } : {})}
          />
        );
      }}
    />
  );
}

RHFPlainNumInput.defaultProps = {
  mode: "onChange",
  onBlur: () => {},
  onChange: () => {},
  updateValueOnBlur: true,
  min: 0,
};

RHFPlainNumInput.propTypes = {
  name: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(["onChange", "onBlur"]).isRequired,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  updateValueOnBlur: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  rules: PropTypes.object,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default RHFPlainNumInput;
