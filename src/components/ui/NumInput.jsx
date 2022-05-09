import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import PropTypes from "prop-types";

function NumInput(props) {
  const { name, min, max, defaultValue, required } = props;
  const { register } = useFormContext();

  return (
    <NumberInput
      {...{ ...(min ? { min: 0 } : {}), ...(max ? { max: max } : {}) }}
      defaultValue={defaultValue || 0}
    >
      <NumberInputField
        {...register(name, {
          valueAsNumber: true,
          ...(min
            ? {
                min: {
                  value: min,
                  message: `Values should not be less than${min}`,
                },
              }
            : {}),
          ...(max
            ? {
                max: {
                  value: min,
                  message: `Values should not be less than${max}`,
                },
              }
            : {}),
          ...(required
            ? { required: { value: true, message: "*Required!" } }
            : {}),
        })}
      />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  );
}

NumInput.propTypes = {
  name: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  defaultValue: PropTypes.number,
};

export default NumInput;
