import React from "react";
import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
} from "@chakra-ui/react";
import { Controller, useFormContext } from "react-hook-form";

import { RiMoreLine } from "react-icons/ri";

function SKUOptions(props) {
  const { defaultValue, name } = props;
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onBlur, onChange, value, ref } }) => {
        return (
          <Menu onClose={onBlur}>
            <MenuButton
              ref={ref}
              as={IconButton}
              size="sm"
              aria-label="Options"
              icon={<RiMoreLine />}
              borderRadius="sm"
            />
            <MenuList>
              <MenuOptionGroup
                onBlur={onBlur}
                onChange={onChange}
                type="radio"
                value={value}
              >
                <MenuItemOption value="auto">Auto</MenuItemOption>
                <MenuItemOption value="barcode">Barcode</MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        );
      }}
    />
  );
}

export default SKUOptions;
