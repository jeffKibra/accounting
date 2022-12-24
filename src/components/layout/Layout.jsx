import { Flex } from '@chakra-ui/react';

import { DrawerContextProvider } from '../../contexts/DrawerContext';

import { useAuth } from 'hooks';

import AppBar from './AppBar';
import Sidebar from './Sidebar';

function Layout(props) {
  const { children } = props;

  const userProfile = useAuth();

  return (
    <Flex h="100vh" minW="full" overflowY="hidden">
      {userProfile ? (
        <DrawerContextProvider>
          <Sidebar />

          {/* <Box w="100%" minH="56px" maxH="56px" /> */}

          <Flex direction="column" flexGrow={1} overflowY="hidden">
            <AppBar />
            <Flex overflowY="hidden" flexGrow={1}>
              {children}
            </Flex>
          </Flex>
        </DrawerContextProvider>
      ) : (
        <Flex flexGrow={1} overflowY="hidden">
          {children}
        </Flex>
      )}
    </Flex>
  );
}

export default Layout;
