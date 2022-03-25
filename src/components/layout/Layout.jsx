import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Box, Flex, Container } from "@chakra-ui/react";

// import CustomDrawer from "./CustomDrawer";
import * as routes from "../../nav/routes";
import AppBar from "./AppBar";
import Sidebar from "./Sidebar";

import { DRAWER_WIDTH } from "../../utils/constants";

function Layout(props) {
  const location = useLocation();
  const { children } = props;

  const isFreeRoute = useMemo(() => {
    const freeRoutes = [routes.LOGIN_USER, routes.LOGOUT_USER, routes.SIGNUP];

    const route = freeRoutes.find((route) => route === location.pathname);
    if (!route) {
      return false;
    }

    return true;
  }, [location]);

  return (
    <Flex minHeight="100vh" minW="full" position="relative">
      {isFreeRoute ? (
        children
      ) : (
        <>
          <Sidebar />
          <Flex direction="column" flexGrow={1} position="relative">
            <AppBar />
            <Box w="100%" minH="56px" maxH="56px" />
            <Container
              ml={`${DRAWER_WIDTH}px`}
              // minH="100vh"
              maxW={`calc(100% - ${DRAWER_WIDTH}px)`}
              w="full"
              p={4}
              mb="28"
            >
              {children}
            </Container>
          </Flex>
        </>
      )}
      {/* <CustomDrawer /> */}
    </Flex>
  );
}

export default Layout;
