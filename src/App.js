import { ChakraProvider, Box, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import Layout from "./components/layout/Layout";
import Card, {
  CardHeader,
  CardContent,
  CardActions,
} from "./components/ui/Card";

const config = (theme) => {
  console.log({ theme });

  return {
    initialColorMode: "light",
    useSystemColorMode: false,
  };
};

const colors = {
  card: "#fff",
};

const styles = {
  global: (props) => {
    console.log({ props });
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

const theme = extendTheme({ config, styles, colors });

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Layout>hey there!</Layout>
      {/* <Box w={400}>
        <Card>
          <>
            <CardHeader>Plus and minus</CardHeader>
            <CardContent>minus</CardContent>
            <CardActions>plus</CardActions>
          </>
        </Card>
      </Box> */}
    </ChakraProvider>
  );
}

export default App;
