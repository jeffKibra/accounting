import {
  CheckboxGroup as ChakraCheckboxGroup,
  Checkbox,
  Stack,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

function getValue(field, valueField) {
  let value = String(field);

  if (typeof field === 'object') {
    value = field[valueField];
  }

  return value;
}

export default function ControlledCheckboxGroup(props) {
  const {
    name,
    onChange,
    onFieldChange,
    onBlur,
    checkedValues,
    fields,
    nameField,
    valueField,
  } = props;

  console.log({ checkedValues });

  if (!Array.isArray(fields)) {
    return null;
  }

  const allChecked = fields.length === checkedValues.length;
  const isIndeterminate =
    checkedValues.length > 0 && checkedValues.length < fields.length;

  function handleChange(incomingCheckedValues) {
    // const isChecked = e.target.checked;
    onChange(incomingCheckedValues);
  }

  function handleFieldChange(e) {
    console.log('handle field change', { e });
    const isChecked = e?.target?.checked;
    const value = e?.target?.value;

    typeof onFieldChange === 'function' && onFieldChange(value, isChecked);
  }

  function handleIndeterminateChange(e) {
    const isChecked = e.target.checked;
    console.log({ isChecked });

    const incomingCheckedValues = [];

    if (isChecked) {
      fields.forEach(field => {
        const fieldValue = getValue(field, valueField);

        incomingCheckedValues.push(fieldValue);
      });
    }

    console.log({ incomingCheckedValues });

    onChange(incomingCheckedValues);
  }

  return (
    <Stack>
      {name ? (
        <Checkbox
          isChecked={allChecked}
          isIndeterminate={isIndeterminate}
          onChange={handleIndeterminateChange}
        >
          <b>{name}</b>
        </Checkbox>
      ) : null}

      <ChakraCheckboxGroup
        colorScheme="cyan"
        onChange={handleChange}
        value={checkedValues || []}
      >
        <Stack pl={6}>
          {fields.map(field => {
            let name = String(field);
            let value = String(field);

            if (typeof field === 'object') {
              name = fields[nameField];
              value = fields[valueField];
            }

            return (
              <Checkbox onChange={handleFieldChange} value={value}>
                {name}
              </Checkbox>
            );
          })}
        </Stack>
      </ChakraCheckboxGroup>
    </Stack>
  );
}

ControlledCheckboxGroup.defaultProps = {
  onFieldChange: () => {},
};

export const CheckboxGroupPropTypes = {
  name: PropTypes.string,
  fields: PropTypes.array.isRequired,
  nameField: PropTypes.string,
  valueField: PropTypes.string,
  onFieldChange: PropTypes.func,
};

const ControlledCheckboxGroupPropTypes = {
  checkedValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
};

ControlledCheckboxGroup.propTypes = {
  ...ControlledCheckboxGroupPropTypes,
  ...CheckboxGroupPropTypes,
};
