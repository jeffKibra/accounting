import {
  Avatar,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Flex,
  VStack,
  Text,
  Button,
} from "@chakra-ui/react";
import { RiUser4Line } from "react-icons/ri";

function UserAccountDetails() {
  return (
    <Menu>
      <Avatar
        colorScheme="blue"
        as={MenuButton}
        size="md"
        bg="blue.300"
        _hover={{
          bg: "blue.200",
        }}
        icon={<Icon as={RiUser4Line} />}
      />
      <MenuList w="250px">
        <Flex w="full">
          <VStack align="center" w="full" px={3}>
            <Avatar
              colorScheme="blue"
              size="lg"
              icon={<Icon as={RiUser4Line} />}
            />
            <Text>Super Admin</Text>
            <Button colorScheme="blue" w="full" size="sm">
              Logout
            </Button>
          </VStack>
        </Flex>
        {/* <MenuItem>plus</MenuItem>
        <MenuItem>minus</MenuItem> */}
      </MenuList>
    </Menu>
  );
}

export default UserAccountDetails;
