import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import ControlledNumInput from './ControlledNumInput';

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
    size,
  } = props;

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      // shouldUnregister={true}
      rules={rules}
      render={({
        field: { value, onBlur: onInputBlur, onChange: onInputChange },
      }) => {
        function getValueToUpdate(val) {
          if (isNaN(val)) {
            return +min;
          }
          return +val < +min ? +min : +val;
        }

        function getValueOnBlur(inputValue) {
          const valueToUpdate = getValueToUpdate(inputValue);
          //update value
          if (updateValueOnBlur) {
            onInputChange(valueToUpdate);
          }
          //trigger blur event for the input
          onInputBlur();
          //call external handle blur event function
          onBlur(valueToUpdate);
        }

        function getValueOnChange(inputValue) {
          const valueToUpdate = getValueToUpdate(inputValue);
          //update value
          onInputChange(valueToUpdate);
          //call external handle onChange event function
          onChange();
        }

        return (
          <ControlledNumInput
            min={min}
            size={size}
            defaultValue={+value}
            getValueOnBlur={getValueOnBlur}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            {...(mode === 'onBlur' ? { getValueOnBlur } : { getValueOnChange })}
            {...(max ? { max } : {})}
          />
        );
      }}
    />
  );
}

RHFPlainNumInput.defaultProps = {
  mode: 'onChange',
  onBlur: () => {},
  onChange: () => {},
  updateValueOnBlur: true,
  min: 0,
  size: 'md',
};

RHFPlainNumInput.propTypes = {
  name: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['onChange', 'onBlur']).isRequired,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  updateValueOnBlur: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  rules: PropTypes.object,
  min: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
};

export default RHFPlainNumInput;
