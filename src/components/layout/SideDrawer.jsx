import { useRef, useContext } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  Box,
  useBreakpointValue,
} from '@chakra-ui/react';
import { RiMenu2Fill } from 'react-icons/ri';

import DrawerContext from '../../contexts/DrawerContext';

import MainSidebar from './MainSidebar';
import SidebarFooter from './SidebarFooter';
import { DRAWER_WIDTH } from '../../constants';

import { useAuth, useOrg } from '../../hooks';

function SideDrawer() {
  const userProfile = useAuth();
  const org = useOrg();
  const { isOpen, onClose, onOpen } = useContext(DrawerContext);
  const firstField = useRef();
  const open = useBreakpointValue({ base: isOpen, lg: false });

  return (
    userProfile &&
    org && (
      <Box display={['block', null, null, 'none']}>
        <IconButton
          variant="ghost"
          onClick={onOpen}
          colorScheme="cyan"
          fontSize="24px"
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

            <DrawerBody p={0}>
              <MainSidebar />
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px">
              <SidebarFooter />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Box>
    )
  );
}

export default SideDrawer;
