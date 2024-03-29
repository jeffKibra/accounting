import { NumberInput, NumberInputField } from '@chakra-ui/react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';

function TableNumInput(props) {
  const {
    name,
    size,
    min,
    max,
    defaultValue,
    isReadOnly,
    isDisabled,
    rules,
    onBlur,
  } = props;
  const { register, setValue, watch } = useFormContext();

  function handleChange(value) {
    setValue(name, Number(value));
  }

  const numvalue = watch(name);

  return (
    <NumberInput
      onChange={handleChange}
      onBlur={onBlur}
      value={numvalue}
      min={min}
      max={max}
      defaultValue={defaultValue || 0}
      size={size || 'md'}
      isReadOnly={isReadOnly}
      isDisabled={isDisabled}
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
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  min: PropTypes.number,
  max: PropTypes.number,
  defaultValue: PropTypes.number,
  isReadOnly: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onBlur: PropTypes.func,
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
