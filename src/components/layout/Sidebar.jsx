import { Box, Divider, Flex } from "@chakra-ui/react";

// import { isAdmin } from "../../utils/roles";
import useAuth from "../../hooks/useAuth";
import useOrg from "../../hooks/useOrg";

import MainSidebar from "./MainSidebar";

import { DRAWER_WIDTH } from "../../utils/constants";
import SidebarFooter from "./SidebarFooter";

export default function Sidebar() {
  const userProfile = useAuth();
  const org = useOrg();
  // console.log({ userProfile, org });

  return userProfile && org ? (
    <Box
      position="relative"
      // top={0}
      // left={0}
      zIndex="sticky"
      bg="white"
      minH="100%"
      w={`${DRAWER_WIDTH}px`}
      minW={`${DRAWER_WIDTH}px`}
      display={["none", null, null, "block"]}
    >
      <Divider />
      <MainSidebar />
      <Box position="absolute" bottom={0} w="full">
        <Divider />
        <Flex w="full" justify="flex-end" p={4}>
          <SidebarFooter />
        </Flex>
      </Box>
    </Box>
  ) : null;
}
