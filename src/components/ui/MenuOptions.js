import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
} from "@chakra-ui/react";
import { RiMoreFill } from "react-icons/ri";
import PropTypes from "prop-types";

import Dialog from "./Dialog";

function MenuOptions(props) {
  const { options } = props;

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Table Options"
        icon={<RiMoreFill />}
        colorScheme="cyan"
        size="sm"
        title="options"
        // variant="outline"
      />
      <MenuList fontSize="md" lineHeight="6">
        {options.map((option, i) => {
          const { name, icon: Icon, dialogDetails, ...extraProps } = option;

          function MenuOption() {
            return (
              <MenuItem {...extraProps} {...(!!Icon ? { icon: <Icon /> } : {})}>
                {name}
              </MenuItem>
            );
          }

          return !!dialogDetails ? (
            <Dialog
              key={i}
              {...dialogDetails}
              renderButton={(onOpen) => {
                return (
                  <Box onClick={onOpen}>
                    <MenuItem
                      {...extraProps}
                      {...(!!Icon ? { icon: <Icon /> } : {})}
                    >
                      {name}
                    </MenuItem>
                  </Box>
                );
              }}
            />
          ) : (
            <MenuOption key={i} />
          );
        })}
      </MenuList>
    </Menu>
  );
}

export default MenuOptions;

MenuOptions.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.any,
      dialogDetails: PropTypes.shape({
        isDone: PropTypes.bool.isRequired,
        loading: PropTypes.bool.isRequired,
        message: PropTypes.any.isRequired,
        onConfirm: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
      }),
    })
  ),
};
