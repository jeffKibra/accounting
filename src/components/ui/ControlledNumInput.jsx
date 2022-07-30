import { useState } from "react";
import { NumberInput, NumberInputField } from "@chakra-ui/react";
import PropTypes from "prop-types";

function ControlledNumInput(props) {
  const {
    getValueOnBlur,
    getValueOnChange,
    isReadOnly,
    isDisabled,
    defaultValue,
  } = props;
  const [value, setValue] = useState(defaultValue || 0);

  function handleChange(inputValue) {
    //set local value
    setValue(inputValue);
    //update parent value if function is provided
    if (getValueOnChange && typeof getValueOnChange === "function") {
      getValueOnChange(inputValue);
    }
  }

  function handleBlur() {
    getValueOnBlur(value);
  }

  return (
    <NumberInput
      onChange={handleChange}
      onBlur={handleBlur}
      value={value}
      min={0}
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

ControlledNumInput.propTypes = {
  gateValueOnBlur: PropTypes.func,
  gateValueOnChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  isDisabled: PropTypes.bool,
  defaultValue: PropTypes.number,
};

export default ControlledNumInput;
