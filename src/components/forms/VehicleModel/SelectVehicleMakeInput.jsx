import PropTypes from 'prop-types';
//
import { useListVehicleMakes } from 'hooks';
//
import ControlledSimpleSelect from 'components/ui/selects/ControlledSimpleSelect';

//
const optionsConfig = { nameField: 'name', valueField: 'name' };

function SelectVehicleMakeInput(props) {
  const { onChange, value, onBlur, disabled } = props;

  const { loading, vehicleMakes } = useListVehicleMakes();

  return (
    <ControlledSimpleSelect
      loading={loading}
      options={vehicleMakes}
      optionsConfig={optionsConfig}
      onChange={onChange}
      selectedValue={value}
      onBlur={onBlur}
      id="selectVehicleMake"
      isDisabled={disabled}
      placeholder="Select Vehicle Make"
      allowClearSelection={false}
    />
  );
}

SelectVehicleMakeInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
};

SelectVehicleMakeInput.defaultProps = {
  onBlur: () => {},
};

export default SelectVehicleMakeInput;
