import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

import { DrawerContextProvider } from "../../contexts/DrawerContext";

import * as routes from "../../nav/routes";
import AppBar from "./AppBar";
import Sidebar from "./Sidebar";

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
    <Flex direction="column" h="100vh" minW="full" overflowY="hidden">
      {isFreeRoute ? (
        <Flex flexGrow={1} overflowY="hidden">
          {children}
        </Flex>
      ) : (
        <DrawerContextProvider>
          <AppBar />
          {/* <Box w="100%" minH="56px" maxH="56px" /> */}

          <Flex flexGrow={1} overflowY="hidden">
            <Sidebar />

            <Flex overflowY="hidden" flexGrow={1}>
              {children}
            </Flex>
          </Flex>
        </DrawerContextProvider>
      )}
    </Flex>
  );
}

export default Layout;
