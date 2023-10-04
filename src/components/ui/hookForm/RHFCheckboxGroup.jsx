import { useFormContext, Controller } from 'react-hook-form';
// import PropTypes from 'prop-types';

import ControlledCheckboxGroup, {
  CheckboxGroupPropTypes,
} from '../ControlledCheckboxGroup';

function RHFCheckboxGroup(props) {
  const { name, ...moreProps } = props;

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { name, onBlur, onChange, value } }) => {
        // console.log({ value });

        return (
          <ControlledCheckboxGroup
            onChange={onChange}
            checkedValues={value || []}
            onBlur={onBlur}
            name={name}
            {...moreProps}
          />
        );
      }}
    />
  );
}

RHFCheckboxGroup.propTypes = {
  ...CheckboxGroupPropTypes,
};

export default RHFCheckboxGroup;
