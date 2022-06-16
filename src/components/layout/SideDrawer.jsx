import { useRef, useContext } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Box,
  useBreakpointValue,
} from "@chakra-ui/react";
import { RiMenu2Fill } from "react-icons/ri";

import DrawerContext from "../../contexts/DrawerContext";

import MainSidebar from "./MainSidebar";
import Title from "./Title";
import SidebarFooter from "./SidebarFooter";
import { DRAWER_WIDTH, BAR_HEIGHT } from "../../constants";

function SideDrawer() {
  const { isOpen, onClose, onOpen } = useContext(DrawerContext);
  const firstField = useRef();
  const open = useBreakpointValue({ base: isOpen, lg: false });

  return (
    <Box display={["block", null, null, "none"]}>
      <IconButton
        variant="outline"
        onClick={onOpen}
        colorScheme="cyan"
        fontSize="large"
        icon={<RiMenu2Fill />}
      />

      <Drawer
        isOpen={open}
        placement="left"
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent w={`${DRAWER_WIDTH}px!important`}>
          <DrawerCloseButton />
          <DrawerHeader
            p={0}
            pl={4}
            display="flex"
            alignItems="center"
            minH={`${BAR_HEIGHT}px`}
            h={`${BAR_HEIGHT}px`}
            borderBottomWidth="1px"
          >
            <Title />
          </DrawerHeader>

          <DrawerBody p={0}>
            <MainSidebar />
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <SidebarFooter />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default SideDrawer;
