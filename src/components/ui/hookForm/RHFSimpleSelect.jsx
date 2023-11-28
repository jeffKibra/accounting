import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import ControlledSimpleSelect, {
  SimpleSelectPropTypes,
} from '../selects/ControlledSimpleSelect';

//----------------------------------------------------------------

RHFSimpleSelect.propTypes = {
  ...SimpleSelectPropTypes,
  name: PropTypes.string.isRequired,
  controllerProps: PropTypes.object,
};

export default function RHFSimpleSelect(props) {
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
          // console.log('RHFSimpleSelect handling change', data);
          onChange(data);
        }

        return (
          <ControlledSimpleSelect
            onChange={handleChange}
            onBlur={onBlur}
            selectedValue={value}
            {...selectProps}
          />
        );
      }}
    />
  );
}
