import { useMemo } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Button,
  Text,
  Box,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';
//
import Empty from '../Empty';
import CustomSpinner from '../CustomSpinner';

// import { sortStrings } from 'utils/functions';

export const SimpleSelectPropTypes = {
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
  loading: PropTypes.bool,
};
//----------------------------------------------------------------

function ControlledSimpleSelect(props) {
  //   console.log({ props });
  const {
    id,
    options,
    placeholder,
    size,
    colorScheme,
    isDisabled,
    renderTrigger,
    allowClearSelection,
    onChange,
    onBlur,
    selectedValue,
    optionsConfig,
    loading,
    extractSelectedObjectCB,
  } = props;
  // console.log({ props });

  const nameField = optionsConfig?.nameField || 'name';
  const valueField = optionsConfig?.valueField || 'value';
  // console.log({ options });
  // console.log({ nameField, valueField });

  const optionsObject = useMemo(() => {
    // console.log('options changed-creating new options object');
    if (Array.isArray(options)) {
      return options.reduce((obj, option) => {
        const value = option[valueField];
        // console.log({ value, option });

        return {
          ...obj,
          [value]: option,
        };
      }, {});
    } else {
      return {};
    }
  }, [options, valueField]);

  // console.log({ optionsObject });

  // useEffect(() => {
  //   options.sort((a, b) => {
  //     console.log({ a, b });
  //     const optionA = String(a[nameField]).toLowerCase();
  //     const optionB = String(b[nameField]).toLowerCase();

  //     return sortStrings(optionA, optionB);
  //   });
  // }, [options, nameField]);

  function handleChange(value) {
    console.log({ value });
    const fullValue = optionsObject[value];
    // console.log({ fullValue });
    onChange(fullValue);
  }

  // console.log({ selectedValue });
  const { selectedValueValue, selectedValueName } = useMemo(() => {
    let selectedValueValue = '';
    let selectedValueName = '';

    if (selectedValue) {
      if (typeof selectedValue === 'object') {
        selectedValueValue = selectedValue[valueField] || '';
        //
        selectedValueName = selectedValue[nameField] || '';
      } else {
        selectedValueValue = selectedValue;
        //
        selectedValueName = selectedValue;
      }
    }

    // console.log({ selectedValueValue });

    return { selectedValueValue, selectedValueName };
  }, [selectedValue, valueField, nameField]);
  // console.log({ selectedValueValue });

  return (
    <Menu matchWidth onClose={onBlur}>
      {({ isOpen }) => {
        return (
          <>
            {renderTrigger ? (
              renderTrigger()
            ) : (
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
                <Box fontSize="sm">{selectedValueName || placeholder}</Box>
              </MenuButton>
            )}

            <MenuList maxH="200px" overflowY="auto">
              {loading ? (
                <CustomSpinner size="md" />
              ) : Array.isArray(options) && options.length > 0 ? (
                <MenuOptionGroup
                  onChange={handleChange}
                  value={selectedValueValue}
                  type="radio"
                >
                  {allowClearSelection && (
                    <MenuItemOption py={1} value="">
                      <Text fontSize="sm">clear selection</Text>
                    </MenuItemOption>
                  )}
                  {options.map((option, i) => {
                    const name = option[nameField];
                    const value = option[valueField];
                    // console.log({ name, value });

                    if (value === selectedValueValue) {
                      //pass value to a callback
                      extractSelectedObjectCB(option);
                    }

                    return (
                      <MenuItemOption py={1} key={i} value={value}>
                        <Box fontSize="sm">{name}</Box>
                      </MenuItemOption>
                    );
                  })}
                </MenuOptionGroup>
              ) : (
                <Empty imageSize="100px" />
              )}
            </MenuList>
          </>
        );
      }}
    </Menu>
  );
}

ControlledSimpleSelect.defaultProps = {
  allowClearSelection: true,
  onBlur: () => {},
  id: 'controlled select',
  options: [],
  optionsConfig: {
    nameField: 'name',
    valueField: 'value',
  },
  extractSelectedObjectCB: () => {},
};

ControlledSimpleSelect.propTypes = {
  ...SimpleSelectPropTypes,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  extractSelectedObjectCB: PropTypes.func,
};

export default ControlledSimpleSelect;
