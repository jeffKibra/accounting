import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import ControlledNumInput from './ControlledNumInput';

//-----------------------------------------------------------------------
FieldArrayNumberInput.defaultProps = {
  onBlur: () => {},
  onChange: () => {},
  updateValueOnBlur: true,
  min: 0,
  size: 'md',
  updateFieldMode: 'onBlur',
};

FieldArrayNumberInput.propTypes = {
  name: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  rules: PropTypes.object,
  min: PropTypes.number,
  max: PropTypes.number,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  updateFieldMode: PropTypes.oneOf(['onBlur', 'onChange']).isRequired,
};

function FieldArrayNumberInput(props) {
  const {
    name,
    rules,
    isDisabled,
    isReadOnly,
    min,
    max,
    size,
    updateFieldMode,
  } = props;

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      // shouldUnregister={true}
      rules={rules}
      render={({ field: { value, onBlur, onChange, name, ref } }) => {
        return (
          <ControlledNumInput
            name={name}
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
            min={min}
            size={size}
            defaultValue={+value}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
            updateFieldMode={updateFieldMode}
            {...(max ? { max } : {})}
          />
        );
      }}
    />
  );
}

export default FieldArrayNumberInput;
