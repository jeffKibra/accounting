import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Button,
  Text,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';

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
    onSearch,
    loading,
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
                {selectedValue ? value[nameField] : placeholder}
              </Text>
            </MenuButton>

            <MenuList>
              {/* <Box> */}
              <Box mt={-2} p={1}>
                <SearchInput isDisabled={isDisabled} onSearch={onSearch} />
              </Box>

              {loading ? (
                <Box
                  w="full"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  py={2}
                >
                  <Spinner />
                </Box>
              ) : (
                <Box maxHeight="100px" overflowY="auto">
                  <MenuOptionGroup
                    // onChange={handleChange}
                    value={selectedValue}
                    type="radio"
                  >
                    {allowClearSelection && (
                      <MenuItemOption py={1} pt={2} value="">
                        <Text fontSize="sm">clear selection</Text>
                      </MenuItemOption>
                    )}

                    {options.map((option, i) => {
                      const itemName = option[nameField];
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
                          <Text fontSize="sm">{itemName}</Text>
                        </MenuItemOption>
                      );
                    })}
                  </MenuOptionGroup>
                </Box>
              )}
              {/* </Box> */}
            </MenuList>
          </>
        );
      }}
    </Menu>
  );
}

ControlledAutoComplete.defaultProps = {
  allowClearSelection: false,
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
  options: PropTypes.array.isRequired,
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
  onSearch: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

ControlledAutoComplete.propTypes = {
  ...autoCompletePropTypes,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  value: PropTypes.string,
};

export default ControlledAutoComplete;

function SearchInput(props) {
  const { id, isDisabled, colorScheme, onSearch } = props;

  const [value, setValue] = useState('');

  function handleChange(inValue) {
    // console.log('search input incoming value', inValue);
    setValue(inValue);
  }

  function handleSearch(inValue) {
    // console.log('searching val:', inValue);

    onSearch(inValue);
  }

  return (
    <ControlledSearchInput
      id={id}
      isDisabled={isDisabled}
      size="sm"
      {...(colorScheme ? { colorScheme } : {})}
      // isActive={isOpen}
      w="full"
      variant="outline"
      textAlign="left"
      fontWeight="normal"
      onChange={handleChange}
      value={value}
      onSearch={handleSearch}
    />
  );
}

SearchInput.propTypes = {
  id: PropTypes.string,
  isDisabled: PropTypes.bool,
  colorScheme: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
};
