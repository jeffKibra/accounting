import { useState, forwardRef, useEffect } from 'react';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

//---------------------------------------------------------------------------

function CNInput(props, ref) {
  const {
    value,
    isReadOnly,
    isDisabled,
    defaultValue,
    min,
    max,
    size,
    updateFieldMode,
    onChange,
    onBlur,
    inputFieldProps,
    showButtons,
  } = props;
  // console.log({ value });

  const [controlledValue, setControlledValue] = useState(
    value || defaultValue || 0
  );
  // console.log({ controlledValue });

  useEffect(() => {
    setControlledValue(value);
  }, [value]);

  const updateFieldOnBlur = updateFieldMode === 'onBlur';
  const updateFieldOnChange = updateFieldMode === 'onChange';

  function handleChange(inputValue) {
    // console.log({ inputValue });
    //set local value
    setControlledValue(+inputValue);

    if (updateFieldOnChange) {
      onChange(inputValue);
    }
  }

  function handleBlur() {
    // console.log('handleBlur');
    onBlur();

    if (updateFieldOnBlur) {
      onChange(controlledValue);
    }
  }

  // useEffect(() => {
  //   let updateValue = defaultValue;
  //   if (isNaN(defaultValue)) {
  //     updateValue = 0;
  //   }
  //   setControlledValue(updateValue);
  // }, [defaultValue]);

  return (
    <NumberInput
      onChange={handleChange}
      onBlur={handleBlur}
      value={controlledValue}
      min={min}
      {...(max ? { max } : {})}
      // defaultValue={defaultValue || 0}
      size={size}
      isReadOnly={isReadOnly}
      isDisabled={isDisabled}
      {...(ref ? { ref } : {})}
    >
      <NumberInputField
        minW="90px"
        textAlign="right"
        {...(showButtons ? {} : { pl: '8px!important', pr: '8px!important' })}
        {...(inputFieldProps ? inputFieldProps : {})}
      />

      {showButtons ? (
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      ) : null}
    </NumberInput>
  );
}

const ControlledNumInput = forwardRef(CNInput);

//----------------------------------------------------------------
ControlledNumInput.propTypes = {
  isReadOnly: PropTypes.bool,
  isDisabled: PropTypes.bool,
  defaultValue: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  updateFieldMode: PropTypes.oneOf(['onBlur', 'onChange']).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  inputFieldProps: PropTypes.object,
};

ControlledNumInput.defaultProps = {
  defaultValue: 0,
  min: 0,
  size: 'md',
  updateFieldMode: 'onBlur',
  onBlur: () => {},
  onChange: () => {},
  showButtons: false,
};

export default ControlledNumInput;
