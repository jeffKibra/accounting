import { useContext } from "react";
import { Icon, HStack, Flex } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import DrawerContext from "../../contexts/DrawerContext";

function DrawerItem({ icon, route, children }) {
  const { pathname } = useLocation();
  const { isOpen, onClose } = useContext(DrawerContext);

  function closeDrawer() {
    if (isOpen) {
      onClose();
    }
  }

  return (
    <HStack
      onClick={closeDrawer}
      as={Link}
      to={route}
      w="full"
      spacing={3}
      align="center"
      px={4}
      py={2}
      _hover={{
        backgroundColor: "blue.200",
      }}
      {...(pathname === route
        ? {
            bg: "blue.100",
          }
        : {})}
    >
      <Flex fontSize={24} align="center">
        <Icon as={icon} />
      </Flex>
      <Flex fontSize={14} align="center" flexGrow={1}>
        {children}
      </Flex>
    </HStack>
  );
}

DrawerItem.propTypes = {
  icon: PropTypes.any.isRequired,
  route: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default DrawerItem;
