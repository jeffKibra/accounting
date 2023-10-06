import {
  CheckboxGroup as ChakraCheckboxGroup,
  Checkbox,
  Stack,
  Grid,
  GridItem,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';

function getNameAndValue(field, nameField, valueField) {
  let value = String(field);
  let name = String(field);

  if (typeof field === 'object') {
    name = field[nameField];
    value = field[valueField];
  }

  return { name, value };
}

export default function ControlledCheckboxGroup(props) {
  const {
    name,
    onChange,
    onFieldChange,
    // onBlur,
    checkedValues,
    fields,
    nameField,
    valueField,
  } = props;

  // console.log({ checkedValues, fields, nameField, valueField });

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
    // console.log({ isChecked });

    const incomingCheckedValues = [];

    if (isChecked) {
      fields.forEach(field => {
        const { value } = getNameAndValue(field, nameField, valueField);

        incomingCheckedValues.push(value);
      });
    }

    // console.log({ incomingCheckedValues });

    onChange(incomingCheckedValues);
  }

  return (
    <Stack>
      {name ? (
        <Checkbox
          colorScheme="cyan"
          isChecked={allChecked}
          isIndeterminate={isIndeterminate}
          onChange={handleIndeterminateChange}
        >
          <Text fontWeight="medium">{name}</Text>
        </Checkbox>
      ) : null}

      <ChakraCheckboxGroup
        colorScheme="cyan"
        onChange={handleChange}
        value={checkedValues || []}
      >
        <Grid pl={6} templateColumns="repeat(12, 1fr)" w="full">
          {fields.map(field => {
            const { name, value } = getNameAndValue(
              field,
              nameField,
              valueField
            );
            // console.log({ name, value });

            return (
              <GridItem colSpan={6}>
                <Checkbox
                  onChange={handleFieldChange}
                  value={value}
                  // style={{ textWrap: 'nowrap' }}
                >
                  {name}
                </Checkbox>
              </GridItem>
            );
          })}
        </Grid>
        <Stack pl={6} direction="row"></Stack>
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
