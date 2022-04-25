import { Flex, Box } from "@chakra-ui/react";

import UserAccountDetails from "../../containers/Auth/UserAccountDetails";
import SideDrawer from "./SideDrawer";
import Title from "./Title";

import { BAR_HEIGHT } from "../../utils/constants";

export default function AppBar() {
  return (
    <Flex
      zIndex="banner"
      bg="white"
      minH={`${BAR_HEIGHT}px`}
      maxH={`${BAR_HEIGHT}px`}
      align="center"
      px={3}
      top={0}
      right={0}
      w="full"
    >
      <SideDrawer />
      <Title />
      <Box flexGrow={1} />
      <UserAccountDetails />
    </Flex>
  );
}
