import {
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Icon,
  HStack,
  VStack,
  Flex,
  Box,
} from "@chakra-ui/react";
import { RiAddLine, RiSubtractLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

function ExpandableDrawerItem(props) {
  const { icon, subRoutes, title } = props;

  return (
    <AccordionItem w="full" borderTop="none">
      {({ isExpanded }) => {
        return (
          <>
            <AccordionButton
              border="none"
              outline="none"
              stroke="none"
              _expanded={{
                bg: "blue.50",
                border: "none",
                outline: "none",
                _hover: {
                  bg: "blue.200",
                },
              }}
              _hover={{
                bg: "blue.200",
              }}
              _focus={{
                shadow: "none",
              }}
            >
              <HStack justify="flex-start" w="full" spacing={3}>
                <Flex align="center" fontSize={24}>
                  <Icon as={icon} />
                </Flex>

                <Flex flexGrow="1" fontSize={14}>
                  {title}
                </Flex>
                <Icon as={isExpanded ? RiSubtractLine : RiAddLine} />
              </HStack>
            </AccordionButton>
            <AccordionPanel
              pl="36px"
              pr={4}
              px={0}
              pb={2}
              pt="1px"
              fontSize={14}
              display="flex"
            >
              <VStack spacing="2px" w="full">
                {subRoutes.map((subRoute, i) => {
                  const { route, title } = subRoute;
                  return (
                    <AccordionPanelItem key={i} route={route}>
                      {title}
                    </AccordionPanelItem>
                  );
                })}
              </VStack>
            </AccordionPanel>
          </>
        );
      }}
    </AccordionItem>
  );
}

ExpandableDrawerItem.propTypes = {
  icon: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  subRoutes: PropTypes.arrayOf(
    PropTypes.shape({
      route: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ExpandableDrawerItem;

function AccordionPanelItem({ route, children }) {
  const { pathname } = useLocation();
  return (
    <Box
      as={Link}
      to={route}
      w="full"
      py={2}
      pl="16px"
      pr={4}
      _hover={{
        backgroundColor: "blue.200",
      }}
      {...(pathname === route
        ? {
            bg: "blue.100",
          }
        : {})}
    >
      {children}
    </Box>
  );
}

AccordionPanelItem.propTypes = {
  route: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired,
};
