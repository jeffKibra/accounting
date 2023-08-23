import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

//
import ControlledDatePicker from '../ControlledDatePicker';
import ControlledDatePickerWithScheduleLoader from '../ControlledDatePickerWithScheduleLoader';

function RHFDatePicker(props) {
  const {
    name,
    isReadOnly,
    required,
    controllerProps,
    itemId,
    loadSchedules,
    ...datePickerProps
  } = props;

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: { value: required, message: '*Required!' },
      }}
      {...controllerProps}
      render={({ field: { name, onBlur, onChange, value, ref } }) => {
        const controlledDatePickerProps = {
          ref,
          name,
          onChange,
          onBlur,
          value,
          isReadOnly,
          itemId,
          ...datePickerProps,
        };

        return loadSchedules && itemId ? (
          <ControlledDatePickerWithScheduleLoader
            itemId={itemId}
            {...controlledDatePickerProps}
          />
        ) : (
          <ControlledDatePicker {...controlledDatePickerProps} />
        );
      }}
    />
  );
}

RHFDatePicker.defaultProps = {
  required: true,
};

RHFDatePicker.propTypes = {
  name: PropTypes.string.isRequired,
  selectsStart: PropTypes.bool,
  selectsEnd: PropTypes.bool,
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  minDate: PropTypes.instanceOf(Date),
  required: PropTypes.bool,
  controllerProps: PropTypes.object,
  itemId: PropTypes.string,
  loadSchedules: PropTypes.bool,
};

export default RHFDatePicker;
