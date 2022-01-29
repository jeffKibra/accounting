import { Box, Flex } from "@chakra-ui/react";
import CustomDrawer from "./CustomDrawer";
import AppBar from "./AppBar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <Flex minHeight="100vh">
      <Sidebar />
      <Box flexGrow={1} position="relative">
        <AppBar />
        <Box w="100%" minH="56px" maxH="56px" />
        <Box p={4}>{children}</Box>
      </Box>

      {/* <CustomDrawer /> */}
    </Flex>
  );
}
