import { Box, Flex, Container } from "@chakra-ui/react";
// import CustomDrawer from "./CustomDrawer";
import AppBar from "./AppBar";
import Sidebar from "./Sidebar";

import { DRAWER_WIDTH } from "../../utils/constants";

export default function Layout({ children }) {
  return (
    <Flex minHeight="100vh" position="relative">
      <Sidebar />
      <Flex direction="column" flexGrow={1} position="relative">
        <AppBar />
        <Box w="100%" minH="56px" maxH="56px" />
        <Container
          ml={`${DRAWER_WIDTH}px`}
          minH="100vh"
          maxW="container.lg"
          p={4}
        >
          {children}
        </Container>
      </Flex>

      {/* <CustomDrawer /> */}
    </Flex>
  );
}
