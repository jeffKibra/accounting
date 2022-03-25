// import { useContext } from "react";
import {
  Avatar,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Flex,
  VStack,
  Text,
  // Button,
} from "@chakra-ui/react";
import { RiUser4Line } from "react-icons/ri";

import LogoutModal from "../../containers/Auth/LogoutModal";

// import { AuthContext } from "../../store/contexts/auth/authContext";

function UserAccountDetails() {
  // const authContext = useContext(AuthContext);

  return (
    <Menu>
      <Avatar
        colorScheme="cyan"
        as={MenuButton}
        size="md"
        bg="cyan.300"
        _hover={{
          bg: "cyan.200",
        }}
        icon={<Icon as={RiUser4Line} />}
      />
      <MenuList w="250px">
        <Flex w="full">
          <VStack align="center" w="full" px={3}>
            <Avatar
              colorScheme="cyan"
              bg="cyan.300"
              _hover={{
                bg: "cyan.200",
              }}
              size="lg"
              icon={<Icon as={RiUser4Line} />}
            />
            <Text>Super Admin</Text>
            <LogoutModal />
          </VStack>
        </Flex>
        {/* <MenuItem>plus</MenuItem>
        <MenuItem>minus</MenuItem> */}
      </MenuList>
    </Menu>
  );
}

export default UserAccountDetails;
