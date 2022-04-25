import { Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";

function SelectAllCheckbox(props) {
  const { name, items, setValue, watch, control } = props;

  const checkedItems = watch(name);

  function onMasterChange(e) {
    const isChecked = e.target.checked;
    if (isChecked) {
      setValue(
        name,
        items.map((obj) => {
          return obj.value;
        })
      );
    } else {
      setValue(name, []);
    }
  }
  // console.log({ items, checkedItems });
  // console.log({ checked: checkedItems?.length, all: items.length });

  return (
    items &&
    Array.isArray(items) && (
      <>
        {items.length > 1 && (
          <Checkbox
            w="full"
            isChecked={checkedItems?.length === items.length}
            isIndeterminate={
              checkedItems?.length > 0 && checkedItems?.length < items.length
            }
            name="all"
            onChange={onMasterChange}
            colorScheme="cyan"
          >
            Select All
          </Checkbox>
        )}
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            const { ref, ...rest } = field;
            return (
              <CheckboxGroup {...rest} colorScheme="cyan">
                <Stack pl={6} mt={1} spacing={2} direction={["column", "row"]}>
                  {items.map((item, i) => {
                    const { value, name: itemName } = item;

                    return (
                      <Checkbox key={i} value={value}>
                        {itemName}
                      </Checkbox>
                    );
                  })}
                </Stack>
              </CheckboxGroup>
            );
          }}
        />
      </>
    )
  );
}

SelectAllCheckbox.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  control: PropTypes.object.isRequired,
};

export default SelectAllCheckbox;
