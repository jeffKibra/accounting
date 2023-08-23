import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
//
//
//
import ControlledDatePickerWithScheduleLoader from 'components/ui/ControlledDatePickerWithScheduleLoader';
// import CustomDatePicker from './CustomDatePicker';

//----------------------------------------------------------------

RHFDatePickerWithScheduleLoader.propTypes = {
  isReadOnly: PropTypes.bool,
  name: PropTypes.string.isRequired,
  controllerProps: PropTypes.object,
};

RHFDatePickerWithScheduleLoader.defaultProps = {
  controllerProps: {},
};

export default function RHFDatePickerWithScheduleLoader(props) {
  const { name, isReadOnly, controllerProps, ...moreProps } = props;

  const { control, watch } = useFormContext();

  const item = watch('item');
  const itemId = item?.itemId;

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: { value: true, message: '*Required!' },
      }}
      {...controllerProps}
      render={({ field: { name, onBlur, onChange, value, ref } }) => {
        return (
          <ControlledDatePickerWithScheduleLoader
            ref={ref}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            isReadOnly={isReadOnly}
            itemId={itemId}
            {...moreProps}
          />
        );
      }}
    />
  );
}
