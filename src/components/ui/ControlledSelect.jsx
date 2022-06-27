import {
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Button,
  Text,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";

import { sortStrings } from "../../utils/functions";

function Grouped(props) {
  const { options, onChange, value } = props;
  let groups = [];

  options.forEach((option) => {
    const { groupName } = option;
    const index = groups.findIndex((group) => group.groupName === groupName);
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

    return sortStrings(groupA, groupB);
  });

  groups = groups.map((group) => {
    const { groupName } = group;
    const groupOptions = options.filter(
      (option) => option.groupName === groupName
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
};

function Normal(props) {
  const { options: opts, onChange, value, allowClearSelection } = props;
  const options = [...opts];

  options.sort((a, b) => {
    const optionA = String(a?.name).toLowerCase();
    const optionB = String(b?.name).toLowerCase();

    return sortStrings(optionA, optionB);
  });

  return (
    <MenuOptionGroup onChange={onChange} value={value} type="radio">
      {allowClearSelection && (
        <MenuItemOption py={1} value="">
          <Text fontSize="sm">clear selection</Text>
        </MenuItemOption>
      )}
      {options.map(({ name, value }, i) => {
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
                size={size || "sm"}
                {...(colorScheme ? { colorScheme } : {})}
                isActive={isOpen}
                isFullWidth
                variant="outline"
                textAlign="left"
                rightIcon={isOpen ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                fontWeight="normal"
              >
                <Text fontSize="sm">
                  {value
                    ? currentOptions.find((option) => option.value === value)
                        ?.name
                    : placeholder}
                </Text>
              </MenuButton>
            )}

            <MenuList maxH="250px" overflowY="auto">
              {groupedOptions?.length > 0 ? (
                <Grouped
                  onChange={onChange}
                  value={value}
                  options={groupedOptions}
                  placeholder={placeholder}
                />
              ) : options?.length > 0 ? (
                <Normal
                  onChange={onChange}
                  value={value}
                  options={options}
                  placeholder={placeholder}
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
  id: "controlled select",
};

ControlledSelect.propTypes = {
  options: Normal.propTypes.options,
  groupedOptions: Grouped.propTypes.options,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  colorScheme: PropTypes.string,
  isDisabled: PropTypes.bool,
  renderTrigger: PropTypes.func,
  allowClearSelection: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  value: PropTypes.string.isRequired,
};

export default ControlledSelect;