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
    // console.log({ value });
    const fullValue = optionsObject[value];
    // console.log({ fullValue });
    onChange(fullValue);
  }

  const selectedValueValue = selectedValue ? selectedValue[valueField] : '';
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
                <Text fontSize="sm">
                  {selectedValue ? selectedValue[nameField] : placeholder}
                </Text>
              </MenuButton>
            )}

            <MenuList maxH="200px" overflowY="auto">
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

                  return (
                    <MenuItemOption py={1} key={i} value={value}>
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

ControlledSimpleSelect.defaultProps = {
  allowClearSelection: true,
  onBlur: () => {},
  id: 'controlled select',
  options: [],
  optionsConfig: {
    nameField: 'name',
    valueField: 'value',
  },
};

ControlledSimpleSelect.propTypes = {
  ...SimpleSelectPropTypes,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  value: PropTypes.string,
};

export default ControlledSimpleSelect;
