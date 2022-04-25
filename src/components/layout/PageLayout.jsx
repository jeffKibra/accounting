import { Divider, Heading, VStack, HStack, Flex } from "@chakra-ui/react";
import PropTypes from "prop-types";

function PageLayout(props) {
  const { pageTitle, actions, children } = props;
  return (
    <VStack
      flexGrow={1}
      overflowY="hidden"
      textAlign="left"
      alignItems="stretch"
    >
      <HStack py={2} px={4}>
        <Heading as="h3" size="md">
          {pageTitle}
        </Heading>
        <Flex flexGrow={1}></Flex>
        {actions}
      </HStack>

      <Flex px={4} mt="0px!important">
        <Divider backgroundColor="blackAlpha.600" />
      </Flex>

      <VStack
        flexGrow={1}
        overflowY="auto"
        w="full"
        alignItems="center"
        px={4}
        pt={4}
        pb={4}
      >
        {children}
        <Flex w="full" h="100px" minH="100px" />
      </VStack>
    </VStack>
  );
}

PageLayout.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  actions: PropTypes.node,
  children: PropTypes.any,
};

export default PageLayout;
