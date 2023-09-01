import { useState, forwardRef } from 'react';
import { Textarea } from '@chakra-ui/react';
import PropTypes from 'prop-types';

//----------------------------------------------------------------
ControlledTextarea.propTypes = {
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  updateFieldMode: PropTypes.oneOf(['onBlur', 'onChange']).isRequired,
  defaultValue: PropTypes.string,
};

ControlledTextarea.defaultProps = {
  updateFieldMode: 'onBlur',
  onBlur: () => {},
  onChange: () => {},
  defaultValue: '',
};

function ControlledTextarea(props, ref) {
  const { updateFieldMode, onBlur, onChange, defaultValue, ...inputProps } =
    props;

  const updateFieldOnBlur = updateFieldMode === 'onBlur';
  const updateFieldOnChange = updateFieldMode === 'onChange';

  const [controlledValue, setControlledValue] = useState(defaultValue || '');

  function handleFieldBlur() {
    onBlur();

    if (updateFieldOnBlur) {
      //update value using onChange
      onChange(controlledValue);
    }
  }

  function handleFieldValueChange(e) {
    const newValue = e.target.value;
    setControlledValue(newValue);

    if (updateFieldOnChange) {
      onChange(newValue);
    }
  }

  return (
    <Textarea
      value={controlledValue}
      onChange={handleFieldValueChange}
      onBlur={handleFieldBlur}
      resize="none"
      size="xs"
      rows={2}
      {...(ref ? { ref } : {})}
      {...inputProps}
    />
  );
}

export default forwardRef(ControlledTextarea);
