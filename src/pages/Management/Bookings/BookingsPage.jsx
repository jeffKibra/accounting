import { Button } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { RiAddLine } from 'react-icons/ri';

//
import { SearchBookingsContextProvider } from 'contexts/SearchBookingsContext';

import { NEW_BOOKING } from '../../../nav/routes';
//
//
import useSavedLocation from '../../../hooks/useSavedLocation';
import PageLayout from '../../../components/layout/PageLayout';

import Bookings from '../../../containers/Management/Bookings/Bookings';

function BookingsPage() {
  useSavedLocation().setLocation();
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
      <SearchBookingsContextProvider>
        <Bookings />
      </SearchBookingsContextProvider>
    </PageLayout>
  );
}

export default BookingsPage;
