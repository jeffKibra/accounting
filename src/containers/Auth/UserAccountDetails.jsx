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
  Heading,
} from "@chakra-ui/react";
import { RiUser4Line } from "react-icons/ri";

import useAuth from "../../hooks/useAuth";
import useOrg from "../../hooks/useOrg";

import LogoutModal from "./LogoutModal";

function UserAccountDetails() {
  const userProfile = useAuth();
  const org = useOrg();

  return (
    userProfile && (
      <Menu>
        <Avatar
          colorScheme="cyan"
          as={MenuButton}
          size="sm"
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
              <Heading size="sm">{userProfile.name}</Heading>
              <Text>{userProfile.email}</Text>
              {org && <Text>{org.name}</Text>}
              <LogoutModal />
            </VStack>
          </Flex>
          {/* <MenuItem>plus</MenuItem>
        <MenuItem>minus</MenuItem> */}
        </MenuList>
      </Menu>
    )
  );
}

export default UserAccountDetails;
