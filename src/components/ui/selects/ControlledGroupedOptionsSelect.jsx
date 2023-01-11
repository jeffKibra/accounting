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

import { sortStrings } from '../../../utils/functions';

//----------------------------------------------------------------
export const ControlledGroupedOptionsSelectPropTypes = {
  options: PropTypes.array.isRequired,
  optionsConfig: PropTypes.shape({
    groupNameField: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
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

function ControlledGroupedOptionsSelect(props) {
  //   console.log({ props });
  const {
    id,
    options,
    placeholder,
    size,
    colorScheme,
    isDisabled,
    renderTrigger,
    // allowClearSelection,
    onChange,
    onBlur,
    selectedValue,
    optionsConfig,
  } = props;

  const nameField = optionsConfig?.nameField || 'name';
  const valueField = optionsConfig?.valueField || 'value';
  const groupNameField = optionsConfig?.groupNameField || 'groupName';

  const { groups, optionsObject } = useMemo(() => {
    let optionsObject = {};
    let groupsObject = {};

    if (Array.isArray(options)) {
      groupsObject = options.reduce((groupsObj, option) => {
        const optionValue = option[valueField];
        optionsObject[optionValue] = option;
        //
        const groupName = retrieveGroupName(option, groupNameField);
        const currentGroupOptions = groupsObj[groupName]?.options || [];
        const incomingGroupOptions = [...currentGroupOptions, option];

        return {
          ...groupsObj,
          [groupName]: {
            groupName,
            options: incomingGroupOptions,
          },
        };
      }, {});
    }

    const groups = Object.values(groupsObject);

    groups.sort((a, b) => {
      const groupA = String(a.groupName).toLowerCase();
      const groupB = String(b.groupName).toLowerCase();

      return sortStrings(groupA, groupB);
    });

    return { groups, optionsObject };
  }, [options, groupNameField, valueField]);

  // console.log({ groups, optionsObject });

  function handleChange(value) {
    const fullValue = optionsObject[value];
    onChange(fullValue);
  }

  const selectedValueValue = selectedValue ? selectedValue[valueField] : '';

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
              {groups.map(({ groupName, options }, i, arr) => {
                return (
                  <MenuOptionGroup
                    onChange={handleChange}
                    value={selectedValueValue}
                    type="radio"
                    title={groupName}
                    color="#718096"
                    my={1}
                    mb={0}
                    key={i}
                  >
                    {/* {allowClearSelection && (
                      <MenuItemOption py={1} value="">
                        <Text fontSize="sm">clear selection</Text>
                      </MenuItemOption>
                    )} */}
                    {/* <MenuItemOption py={1} value="">
          <Text fontSize="sm">clear selection</Text>
        </MenuItemOption> */}
                    {options.map((option, index) => {
                      const name = option[nameField];
                      const value = option[valueField];

                      return (
                        <MenuItemOption key={index} py={1} value={value}>
                          <Text fontSize="sm">{name}</Text>
                        </MenuItemOption>
                      );
                    })}
                  </MenuOptionGroup>
                );
              })}
            </MenuList>
          </>
        );
      }}
    </Menu>
  );
}

ControlledGroupedOptionsSelect.defaultProps = {
  allowClearSelection: true,
  onBlur: () => {},
  id: 'controlled select',
};

ControlledGroupedOptionsSelect.propTypes = {
  ...ControlledGroupedOptionsSelectPropTypes,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  selectedValue: PropTypes.object,
};

export default ControlledGroupedOptionsSelect;

function retrieveGroupName(option, groupNameField) {
  if (Array.isArray(groupNameField)) {
    return groupNameField.reduce((acc, stringValue) => {
      if (acc && !Array.isArray(acc) && typeof acc === 'object') {
        return acc[stringValue];
      } else {
        return acc;
      }
    }, option);
  } else {
    return option[groupNameField];
  }
}
