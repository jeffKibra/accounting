import { NumberInput, NumberInputField } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";

function TableNumInput(props) {
  const { name, min, max, defaultValue, loading, rules } = props;
  const { register, setValue, watch } = useFormContext();

  function handleChange(value) {
    setValue(name, Number(value));
  }

  const numvalue = watch(name);

  return (
    <NumberInput
      onChange={handleChange}
      value={numvalue}
      min={min}
      max={max}
      defaultValue={defaultValue || 0}
      size="sm"
      isReadOnly={loading}
    >
      <NumberInputField
        minW="90px"
        textAlign="right"
        pl="8px!important"
        pr="8px!important"
        {...register(name, {
          valueAsNumber: true,
          ...(rules ? rules : {}),
        })}
      />
    </NumberInput>
  );
}

TableNumInput.propTypes = {
  name: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  defaultValue: PropTypes.number,
  loading: PropTypes.bool.isRequired,
  rules: PropTypes.shape({
    required: PropTypes.shape({
      value: PropTypes.bool,
      message: PropTypes.string,
    }),
    min: PropTypes.shape({
      value: PropTypes.number,
      message: PropTypes.string,
    }),
    max: PropTypes.shape({
      value: PropTypes.number,
      message: PropTypes.string,
    }),
    minlength: PropTypes.shape({
      value: PropTypes.number,
      message: PropTypes.string,
    }),
    maxLength: PropTypes.shape({
      value: PropTypes.number,
      message: PropTypes.string,
    }),
    pattern: PropTypes.object,
  }),
};

export default TableNumInput;
