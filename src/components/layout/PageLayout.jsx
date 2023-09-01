import {
  Heading,
  VStack,
  HStack,
  Flex,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

function PageLayout(props) {
  const { pageTitle, actions, children, breadcrumbLinks } = props;
  const location = useLocation();

  return (
    <VStack
      flexGrow={1}
      overflowY="hidden"
      textAlign="left"
      alignItems="stretch"
    >
      <HStack py={2} px={[4, 6]}>
        <VStack alignItems="flex-start">
          <Heading as="h3" fontSize={['20px', null, '24px']}>
            {pageTitle}
          </Heading>
          {breadcrumbLinks && typeof breadcrumbLinks === 'object' && (
            <Breadcrumb fontSize="sm">
              {Object.keys(breadcrumbLinks).map((key, i) => {
                const link = breadcrumbLinks[key];
                return (
                  <BreadcrumbItem
                    key={i}
                    isCurrentPage={link === location.pathname}
                  >
                    <BreadcrumbLink as={Link} to={link}>
                      {key}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                );
              })}
            </Breadcrumb>
          )}
        </VStack>

        <Flex flexGrow={1}></Flex>
        {actions}
      </HStack>

      {/* <Flex px={4} mt="0px!important">
        <Divider backgroundColor="blackAlpha.600" />
      </Flex> */}

      <VStack
        flexGrow={1}
        overflowY="auto"
        w="full"
        alignItems="center"
        px={[4, 6]}
        pt={4}
        pb={4}
        mt="0px!important"
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
  breadcrumbLinks: PropTypes.object,
};

export default PageLayout;
