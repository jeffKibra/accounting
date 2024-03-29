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

function Normal(props) {
  const { options: opts, onChange, value, allowClearSelection } = props;
  const options = [...opts];

  options.sort((a, b) => {
    const optionA = String(a?.name).toLowerCase();
    const optionB = String(b?.name).toLowerCase();

    return sortStrings(optionA, optionB);
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
                  {value
                    ? currentOptions.find(option => option.value === value)
                        ?.name
                    : placeholder}
                </Text>
              </MenuButton>
            )}

            <MenuList maxH="200px" overflowY="auto">
              <Normal
                onChange={onChange}
                value={value}
                options={options}
                placeholder={placeholder}
                allowClearSelection={allowClearSelection}
              />
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
};

export default ControlledSelect;
