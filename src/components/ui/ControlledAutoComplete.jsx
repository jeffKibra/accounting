import { Box } from '@chakra-ui/react';
import PropTypeps from 'prop-types';

import { useMemo } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Button,
  Text,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';

// import { sortStrings } from 'utils/functions';

import ControlledSearchInput, {
  controlledSearchInputPropTypes,
} from './ControlledSearchInput';




//----------------------------------------------------------------

function ControlledAutoComplete(props) {
  //   console.log({ props });
  const {
    id,
    options,
    placeholder,
    size,
    colorScheme,
    isDisabled,
    allowClearSelection,
    onChange,
    value,
    onBlur,
    optionsConfig,
  } = props;
  // console.log({ props });

  const nameField = optionsConfig?.nameField || 'name';
  const valueField = optionsConfig?.valueField || 'value';
  // console.log({ options });
  // console.log({ nameField, valueField });

  function handleChange(value) {
    // console.log({ value });
    onChange(value);
  }

  const selectedValue = value
    ? typeof value === 'object'
      ? value[valueField]
      : value
    : '';
  // console.log({ selectedValue });

  return (
    <Menu isLazy matchWidth onClose={onBlur}>
      {({ isOpen }) => {
        return (
          <>
            <MenuButton
              as={Button}
              id={id}
              isDisabled={isDisabled}
              size={size || 'md'}
              {...(colorScheme ? { colorScheme } : {})}
              isActive={isOpen}
              w="full"
              variant="outline"
              textAlign="left"
              rightIcon={isOpen ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
              fontWeight="normal"
            >
              <Text fontSize="sm">
                {selectedValue ? selectedValue[nameField] : placeholder}
              </Text>
            </MenuButton>

            <MenuList maxH="200px" overflowY="auto">
              <ControlledSearchInput
                id={id}
                isDisabled={isDisabled}
                size={size || 'md'}
                {...(colorScheme ? { colorScheme } : {})}
                isActive={isOpen}
                w="full"
                variant="outline"
                textAlign="left"
                fontWeight="normal"
              />

              <MenuOptionGroup
                onChange={handleChange}
                value={selectedValue}
                type="radio"
              >
                {allowClearSelection && (
                  <MenuItemOption py={1} value="">
                    <Text fontSize="sm">clear selection</Text>
                  </MenuItemOption>
                )}
                {options.map((option, i) => {
                  const name = option[nameField];
                  const itemValue = option[valueField];
                  // console.log({ name, value });

                  function handleItemClick() {
                    handleChange(option);
                  }

                  return (
                    <MenuItemOption
                      onClick={handleItemClick}
                      py={1}
                      key={i}
                      value={itemValue}
                    >
                      <Text fontSize="sm">{name}</Text>
                    </MenuItemOption>
                  );
                })}
              </MenuOptionGroup>
            </MenuList>
          </>
        );
      }}
    </Menu>
  );
}

ControlledAutoComplete.defaultProps = {
  allowClearSelection: true,
  onBlur: () => {},
  id: 'controlled select',
  options: [],
  optionsConfig: {
    nameField: 'name',
    valueField: 'value',
  },
};



export const autoCompletePropTypes = {
  ...controlledSearchInputPropTypes,
  optionsConfig: PropTypes.shape({
    nameField: PropTypes.string.isRequired,
    valueField: PropTypes.string.isRequired,
  }),
  id: PropTypes.string,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  colorScheme: PropTypes.string,
  isDisabled: PropTypes.bool,
  renderTrigger: PropTypes.func,
  allowClearSelection: PropTypes.bool,
};

ControlledAutoComplete.propTypes = {
  ...autoCompletePropTypes,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  value: PropTypes.string,
};


export default ControlledAutoComplete;
