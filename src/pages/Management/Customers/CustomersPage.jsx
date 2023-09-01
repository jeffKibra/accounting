import { Link, useLocation } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';

import PageLayout from '../../../components/layout/PageLayout';

import useSavedLocation from '../../../hooks/useSavedLocation';

import Customers from '../../../containers/Management/Customers/Customers';

function CustomersPage() {
  useSavedLocation().setLocation();
  const location = useLocation();

  return (
    <PageLayout
      pageTitle="Customers"
      actions={
        <Link to={`${location.pathname}/new`}>
          <Button leftIcon={<RiAddLine />} colorScheme="cyan" size="sm">
            New Customer
          </Button>
        </Link>
      }
      breadcrumbLinks={{
        Dashboard: '/',
        Customers: location.pathname,
      }}
    >
      <Customers />
    </PageLayout>
  );
}

export default CustomersPage;
