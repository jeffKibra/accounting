import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import ControlledAutoComplete, {
  autoCompletePropTypes,
} from '../ControlledAutoComplete';

//----------------------------------------------------------------

RHFAutoComplete.propTypes = {
  ...autoCompletePropTypes,
  name: PropTypes.string.isRequired,
  controllerProps: PropTypes.object,
};

export default function RHFAutoComplete(props) {
  const { name, controllerProps, ...selectProps } = props;
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      // shouldUnregister
      {...controllerProps}
      render={({ field: { onChange, onBlur, value } }) => {
        function handleChange(data) {
          // console.log('RHFAutoComplete handling change', data);
          onChange(data);
        }

        // console.log('autocomplete value', { value });

        return (
          <ControlledAutoComplete
            onChange={handleChange}
            onBlur={onBlur}
            value={value || ''}
            {...selectProps}
          />
        );
      }}
    />
  );
}
