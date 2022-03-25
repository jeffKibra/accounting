import React from "react";
import { IconButton, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { RiMore2Line } from "react-icons/ri";

function IconsMenu(props) {
  const { children } = props;

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<RiMore2Line />}
        variant="outline"
      />
      <MenuList>{children}</MenuList>
    </Menu>
  );
}

IconsMenu.propTypes = {
  children: PropTypes.node.isRequired,
};

export default IconsMenu;
