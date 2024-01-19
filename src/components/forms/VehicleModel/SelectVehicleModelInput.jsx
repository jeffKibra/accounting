import { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
//
import { useGetVehicleMake } from 'hooks';
//
import ControlledSimpleSelect from 'components/ui/selects/ControlledSimpleSelect';

//
const optionsConfig = { nameField: 'name', valueField: 'name' };

function SelectVehicleModelInput(props) {
  const { onChange, value, onBlur, disabled, make, extractSelectedModelCB } =
    props;

  const { loading, vehicleMake, refetch } = useGetVehicleMake();

  useEffect(() => {
    refetch(make);
  }, [refetch, make]);

  const options = useMemo(() => {
    const models = vehicleMake?.models || [];

    const localOptions = make
      ? models
      : [
          {
            make: '',
            name: 'Select a valid Vehicle Make first!',
            year: '',
            id: '',
          },
        ];

    return localOptions;
  }, [vehicleMake, make]);

  return (
    <ControlledSimpleSelect
      loading={loading}
      options={options}
      optionsConfig={optionsConfig}
      onChange={onChange}
      selectedValue={value}
      onBlur={onBlur}
      id="select_vehicle_model"
      isDisabled={disabled}
      placeholder="Select Vehicle Model"
      allowClearSelection={false}
      extractSelectedObjectCB={extractSelectedModelCB}
    />
  );
}

SelectVehicleModelInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  make: PropTypes.string.isRequired,
  extractSelectedModelCB: PropTypes.func,
};

SelectVehicleModelInput.defaultProps = {
  onBlur: () => {},
  extractSelectedModelCB: () => {},
};

export default SelectVehicleModelInput;
