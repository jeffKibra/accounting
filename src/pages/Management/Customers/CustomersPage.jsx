import { Link, useLocation } from 'react-router-dom';
import { Button, Box } from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';

import PageLayout from '../../../components/layout/PageLayout';

// import useSavedLocation from '../../../hooks/useSavedLocation';
///
import { SearchContactsContextProvider } from 'contexts/SearchContactsContext';

// import Customers from '../../../containers/Management/Customers/Customers';
import CustomersTable from 'components/tables/Customers/CustomersTable';

function CustomersPage() {
  // useSavedLocation().setLocation();
  const location = useLocation();

  return (
    <PageLayout
      pageTitle="Customers"
      actions={
        <Link to={`${location.pathname}/new`}>
          <Button leftIcon={<RiAddLine />} colorScheme="cyan" size="sm">
            New
          </Button>
        </Link>
      }
      breadcrumbLinks={{
        Dashboard: '/',
        Customers: location.pathname,
      }}
    >
      <SearchContactsContextProvider group="customer">
        <Box
          mt={-2}
          w="full"
          bg="white"
          borderRadius="md"
          shadow="md"
          py={4}
          // px={2}
        >
          <CustomersTable />
        </Box>
      </SearchContactsContextProvider>
    </PageLayout>
  );
}

export default CustomersPage;
