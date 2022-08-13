import { Flex, Box } from '@chakra-ui/react';

import UserAccountDetails from '../../containers/Auth/UserAccountDetails';
import SideDrawer from './SideDrawer';

import { BAR_HEIGHT } from '../../constants';

export default function AppBar() {
  return (
    <Flex
      zIndex="banner"
      bg="white"
      minH={`${BAR_HEIGHT}px`}
      maxH={`${BAR_HEIGHT}px`}
      align="center"
      px={[4, null, 6]}
      top={0}
      right={0}
      w="full"
    >
      <SideDrawer />
      <Box flexGrow={1} />
      <UserAccountDetails />
    </Flex>
  );
}
