import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import ControlledTextarea from './ControlledTextarea';

//----------------------------------------------------------------
FieldArrayTextarea.propTypes = {
  name: PropTypes.string.isRequired,
  controllerProps: PropTypes.object,
  inputProps: PropTypes.object,
  updateFieldMode: PropTypes.oneOf(['onBlur', 'onChange']).isRequired,
};

FieldArrayTextarea.defaultProps = {
  updateFieldMode: 'onBlur',
};

export default function FieldArrayTextarea(props) {
  const { name, controllerProps, inputProps, updateFieldMode } = props;
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { onBlur, onChange, name, ref } = field;

        return (
          <ControlledTextarea
            name={name}
            ref={ref}
            onChange={onChange}
            onBlur={onBlur}
            updateFieldMode={updateFieldMode}
            {...inputProps}
          />
        );
      }}
      {...controllerProps}
    />
  );
}
