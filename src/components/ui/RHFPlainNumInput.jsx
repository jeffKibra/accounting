import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import ControlledNumInput from './ControlledNumInput';

//----------------------------------------------------------------
RHFPlainNumInput.propTypes = {
  name: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['onChange', 'onBlur']).isRequired,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  onChange: PropTypes.func,
  rules: PropTypes.object,
  min: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  controllerProps: PropTypes.object,
};

function RHFPlainNumInput(props) {
  const {
    name,
    mode,
    isDisabled,
    isReadOnly,
    updateValueOnBlur,
    onChange,
    rules,
    min,
    max,
    size,
    controllerProps,
    ...moreProps
  } = props;

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      // shouldUnregister={true}
      rules={rules}
      {...controllerProps}
      render={({ field: { value, onBlur, onChange: onInputChange, ref } }) => {
        function handleChange(data) {
          console.log(data);
          if (typeof onChange === 'function') {
            onChange(data);
          } else {
            onInputChange(data);
          }
        }
        // function getValueToUpdate(val) {
        //   if (isNaN(val)) {
        //     return +min;
        //   }
        //   return +val < +min ? +min : +val;
        // }

        // function getValueOnBlur(inputValue) {
        //   const valueToUpdate = getValueToUpdate(inputValue);
        //   //update value
        //   if (updateValueOnBlur) {
        //     onInputChange(valueToUpdate);
        //   }
        //   //trigger blur event for the input
        //   onInputBlur();
        //   //call external handle blur event function
        //   onBlur(valueToUpdate);
        // }

        // function getValueOnChange(inputValue) {
        //   const valueToUpdate = getValueToUpdate(inputValue);
        //   //update value
        //   onInputChange(valueToUpdate);
        //   //call external handle onChange event function
        //   onChange();
        // }

        return (
          <ControlledNumInput
            ref={ref}
            updateFieldMode={mode}
            onChange={handleChange}
            onBlur={onBlur}
            {...moreProps}
            value={value}
            // min={min}
            // size={size}
            // defaultValue={+value}
            // getValueOnBlur={getValueOnBlur}
            // isDisabled={isDisabled}
            // isReadOnly={isReadOnly}
            // {...(mode === 'onBlur' ? { getValueOnBlur } : { getValueOnChange })}
            // {...(max ? { max } : {})}
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

export default RHFPlainNumInput;
