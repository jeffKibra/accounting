import { Flex, Heading, Box } from "@chakra-ui/react";
import UserAccountDetails from "../ui/UserAccountDetails";

import { DRAWER_WIDTH } from "../../utils/constants";

export default function AppBar() {
  return (
    <Flex
      zIndex="sticky"
      shadow="md"
      bg="card"
      minH="56px"
      maxH="56px"
      align="center"
      px={3}
      position="fixed"
      top={0}
      right={0}
      w={`calc(100% - ${DRAWER_WIDTH}px)`}
    >
      <Heading fontWeight="semibold" fontSize="x-large">
        BOOKS
      </Heading>
      <Box flexGrow={1} />
      <UserAccountDetails />
    </Flex>
  );
}
