import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

import ControlledGroupedOptionsSelect, {
  ControlledGroupedOptionsSelectPropTypes,
} from '../selects/ControlledGroupedOptionsSelect';

//----------------------------------------------------------------

RHFGroupedOptionsSelect.propTypes = {
  ...ControlledGroupedOptionsSelectPropTypes,
  name: PropTypes.string.isRequired,
  controllerProps: PropTypes.object,
};

export default function RHFGroupedOptionsSelect(props) {
  const { name, controllerProps, ...selectProps } = props;
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      // shouldUnregister
      {...controllerProps}
      render={({ field: { onChange, onBlur, value } }) => {
        return (
          <ControlledGroupedOptionsSelect
            onChange={onChange}
            onBlur={onBlur}
            selectedValue={value}
            {...selectProps}
          />
        );
      }}
    />
  );
}
