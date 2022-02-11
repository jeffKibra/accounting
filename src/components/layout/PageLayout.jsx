import { Divider, Heading, VStack, HStack } from "@chakra-ui/react";
import PropTypes from "prop-types";

function PageLayout(props) {
  const { pageTitle, actions, children } = props;
  return (
    <VStack textAlign="left" alignItems="stretch">
      <HStack>
        <Heading as="h3" size="md">
          {pageTitle}
        </Heading>
        <div style={{ flexGrow: 1 }}></div>
        {actions}
      </HStack>

      <Divider backgroundColor="blackAlpha.600" />
      {children}
    </VStack>
  );
}

PageLayout.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  actions: PropTypes.node,
  children: PropTypes.any,
};

export default PageLayout;
