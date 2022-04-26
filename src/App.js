import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";
import { BrowserRouter } from "react-router-dom";
import { mode } from "@chakra-ui/theme-tools";

import Layout from "./components/layout/Layout";
import Router from "./nav/Router";
import CheckAuth from "./containers/Auth/CheckAuth";
import CheckOrg from "./containers/Management/Orgs/CheckOrg";

import Toasts from "./components/ui/Toasts";

const config = (theme) => {
  return {
    initialColorMode: "dark",
    useSystemColorMode: false,
  };
};

const colors = {
  card: "#fff",
};

const styles = {
  global: (props) => {
    // console.log({ props });
    return {
      body: {
        fontFamily: "body",
        color: mode("gray.800", "whiteAlpha.900")(props),
        bg: mode("gray.100", "gray.800")(props),
        lineHeight: "base",
      },
      "*::placeholder": {
        color: mode("gray.400", "whiteAlpha.400")(props),
      },
      "*, *::before, &::after": {
        borderColor: mode("gray.200", "whiteAlpha.300")(props),
        wordWrap: "break-word",
      },
    };
  },
};

const components = {
  Steps,
};

const theme = extendTheme({ config, styles, colors, components });

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Toasts />
      <CheckAuth>
        <CheckOrg>
          <BrowserRouter>
            <Layout>
              <Router />
            </Layout>
          </BrowserRouter>
        </CheckOrg>
      </CheckAuth>
    </ChakraProvider>
  );
}

export default App;
