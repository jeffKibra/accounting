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

import { sortStrings } from '../../utils/functions';

function Grouped(props) {
  const { options, onChange, value, sortDirection } = props;
  let groups = [];

  options.forEach(option => {
    const { groupName } = option;
    const index = groups.findIndex(group => group.groupName === groupName);
    if (index === -1) {
      //not found
      groups.push({
        groupName,
      });
    }
  });

  groups.sort((a, b) => {
    const groupA = String(a.groupName).toLowerCase();
    const groupB = String(b.groupName).toLowerCase();

    return sortStrings(groupA, groupB, sortDirection || 'asc');
  });

  groups = groups.map(group => {
    const { groupName } = group;
    const groupOptions = options.filter(
      option => option.groupName === groupName
    );

    return {
      ...group,
      options: groupOptions,
    };
  });

  return groups.map(({ groupName, options }, i, arr) => {
    return (
      <MenuOptionGroup
        onChange={onChange}
        value={value}
        type="radio"
        title={groupName}
        color="#718096"
        my={1}
        mb={0}
        key={i}
      >
        {/* <MenuItemOption py={1} value="">
          <Text fontSize="sm">clear selection</Text>
        </MenuItemOption> */}
        {options.map((option, index) => {
          const { name, value } = option;

          return (
            <MenuItemOption key={index} py={1} value={value}>
              <Text fontSize="sm">{name}</Text>
            </MenuItemOption>
          );
        })}
      </MenuOptionGroup>
    );
  });
}

Grouped.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      groupName: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
};

function Normal(props) {
  const {
    options: opts,
    onChange,
    value,
    sortDirection,
    allowClearSelection,
  } = props;
  const options = [...opts];

  options.sort((a, b) => {
    const optionA = String(a?.name).toLowerCase();
    const optionB = String(b?.name).toLowerCase();

    return sortStrings(optionA, optionB, sortDirection || 'asc');
  });

  function handleChange(iv) {
    console.log({ iv });
    onChange(iv);
  }

  return (
    <MenuOptionGroup onChange={handleChange} value={value} type="radio">
      {allowClearSelection && (
        <MenuItemOption py={1} value="">
          <Text fontSize="sm">clear selection</Text>
        </MenuItemOption>
      )}
      {options.map((option, i) => {
        console.log({ option });
        const { name, value } = option;

        return (
          <MenuItemOption py={1} key={i} value={value}>
            <Text fontSize="sm">{name}</Text>
          </MenuItemOption>
        );
      })}
    </MenuOptionGroup>
  );
}

Normal.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  allowClearSelection: PropTypes.bool,
};

function ControlledSelect(props) {
  //   console.log({ props });
  const {
    id,
    options,
    groupedOptions,
    placeholder,
    size,
    colorScheme,
    isDisabled,
    renderTrigger,
    allowClearSelection,
    onChange,
    onBlur,
    value,
    sortDirection,
    ...triggerProps
  } = props;

  const currentOptions = groupedOptions || options || [];

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
                {...triggerProps}
              >
                <Text fontSize="sm">
                  {value
                    ? currentOptions.find(option => option.value === value)
                        ?.name
                    : placeholder}
                </Text>
              </MenuButton>
            )}

            <MenuList maxH="200px" overflowY="auto">
              {groupedOptions?.length > 0 ? (
                <Grouped
                  onChange={onChange}
                  value={value}
                  options={groupedOptions}
                  placeholder={placeholder}
                  sortDirection={sortDirection}
                />
              ) : options?.length > 0 ? (
                <Normal
                  onChange={onChange}
                  value={value}
                  options={options}
                  placeholder={placeholder}
                  sortDirection={sortDirection}
                  allowClearSelection={allowClearSelection}
                />
              ) : (
                []
              )}
            </MenuList>
          </>
        );
      }}
    </Menu>
  );
}

ControlledSelect.defaultProps = {
  allowClearSelection: true,
  onBlur: () => {},
  id: 'controlled select',
};

ControlledSelect.propTypes = {
  options: Normal.propTypes.options,
  groupedOptions: Grouped.propTypes.options,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  colorScheme: PropTypes.string,
  isDisabled: PropTypes.bool,
  renderTrigger: PropTypes.func,
  allowClearSelection: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  value: PropTypes.string.isRequired,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
};

export default ControlledSelect;
