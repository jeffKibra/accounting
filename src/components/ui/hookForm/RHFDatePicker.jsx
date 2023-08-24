import { useFormContext, Controller } from 'react-hook-form';
import PropTypes from 'prop-types';

//
import ControlledDatePicker from '../ControlledDatePicker';

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
        return (
          <ControlledDatePicker
            ref={ref}
            name={name}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            isReadOnly={isReadOnly}
            itemId={itemId}
            {...datePickerProps}
          />
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
