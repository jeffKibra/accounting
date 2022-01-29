import { Flex } from "@chakra-ui/react";
import Card from "../ui/Card";

export default function AppBar() {
  return (
    <Flex
      position="absolute"
      top="0px"
      zIndex="sticky"
      shadow="md"
      bg="card"
      w="100%"
      minH="56px"
      maxH="56px"
      align="center"
    >
      plus and minus
    </Flex>
  );
}
