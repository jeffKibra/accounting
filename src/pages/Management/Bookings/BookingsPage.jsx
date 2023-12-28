import { Button, Box } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { RiAddLine } from 'react-icons/ri';

//
import { ListInvoicesContextProvider } from 'contexts/ListInvoicesContext';

import { NEW_BOOKING } from 'nav/routes';
//
//
// import useSavedLocation from 'hooks/useSavedLocation';
import PageLayout from 'components/layout/PageLayout';

import BookingsTable from 'components/tables/Bookings/BookingsTable';

// import Bookings from 'containers/Management/Bookings/Bookings';

function BookingsPage() {
  //useSavedLocation().setLocation();
  const location = useLocation();

  return (
    <PageLayout
      pageTitle="Bookings"
      actions={
        <Link to={NEW_BOOKING}>
          <Button leftIcon={<RiAddLine />} colorScheme="cyan" size="sm">
            New
          </Button>
        </Link>
      }
      breadcrumbLinks={{
        Dashboard: '/',
        Bookings: location.pathname,
      }}
    >
      <ListInvoicesContextProvider>
        <Box
          mt={-2}
          w="full"
          bg="white"
          borderRadius="md"
          shadow="md"
          py={4}
          // px={2}
        >
          <BookingsTable
            showCustomer
            columnsToExclude={['paymentAllocationInput', 'allocatedAmount', 'id']}
          />
        </Box>
        {/* <Bookings /> */}
      </ListInvoicesContextProvider>
    </PageLayout>
  );
}

export default BookingsPage;
