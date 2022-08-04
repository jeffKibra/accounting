import { useState, useEffect } from "react";
import { NumberInput, NumberInputField } from "@chakra-ui/react";
import PropTypes from "prop-types";

function ControlledNumInput(props) {
  const {
    getValueOnBlur,
    getValueOnChange,
    isReadOnly,
    isDisabled,
    defaultValue,
    min,
    max,
  } = props;
  const [value, setValue] = useState(defaultValue || 0);

  function handleChange(inputValue) {
    //set local value
    setValue(+inputValue);
    //update parent value if function is provided
    if (getValueOnChange && typeof getValueOnChange === "function") {
      getValueOnChange(+inputValue);
    }
  }

  function handleBlur() {
    getValueOnBlur(+value);
  }

  useEffect(() => {
    let updateValue = defaultValue;
    if (isNaN(defaultValue)) {
      updateValue = 0;
    }
    setValue(updateValue);
  }, [defaultValue]);

  return (
    <NumberInput
      onChange={handleChange}
      onBlur={handleBlur}
      value={value}
      min={min}
      {...(max ? { max } : {})}
      // defaultValue={defaultValue || 0}
      size="sm"
      isReadOnly={isReadOnly}
      isDisabled={isDisabled}
    >
      <NumberInputField
        minW="90px"
        textAlign="right"
        pl="8px!important"
        pr="8px!important"
      />
    </NumberInput>
  );
}

ControlledNumInput.defaultProps = {
  defaultValue: 0,
  min: 0,
};

ControlledNumInput.propTypes = {
  getValueOnBlur: PropTypes.func,
  getValueOnChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  isDisabled: PropTypes.bool,
  defaultValue: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default ControlledNumInput;
