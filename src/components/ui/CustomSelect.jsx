import PropTypes from "prop-types";
import { Controller, useFormContext } from "react-hook-form";

import ControlledSelect from "./ControlledSelect";

function CustomSelect(props) {
  //   console.log({ props });
  const { name, rules, ...rest } = props;
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        ...rules,
      }}
      render={({ field: { onBlur, onChange, value, name } }) => {
        return (
          <ControlledSelect
            {...rest}
            id={name}
            onChange={onChange}
            value={value}
            onBlur={onBlur}
          />
        );
      }}
    />
  );
}

CustomSelect.propTypes = {
  name: PropTypes.string.isRequired,
  rules: PropTypes.object,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  groupedOptions: PropTypes.arrayOf(
    PropTypes.shape({
      groupName: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  colorScheme: PropTypes.string,
  isDisabled: PropTypes.bool,
  renderTrigger: PropTypes.func,
  allowClearSelection: PropTypes.bool,
};

export default CustomSelect;
