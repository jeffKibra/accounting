import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

function NumInput(props) {
  const { name, min, max, defaultValue, rules, ...moreProps } = props;
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
      {...moreProps}
    >
      <NumberInputField
        {...register(name, {
          valueAsNumber: true,
          ...(rules ? rules : {}),
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

export default NumInput;
