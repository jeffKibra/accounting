import { Link, useLocation } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';

import PageLayout from '../../../components/layout/PageLayout';

import useSavedLocation from '../../../hooks/useSavedLocation';

import Vendors from '../../../containers/Management/Vendors/Vendors';

function VendorsPage() {
  useSavedLocation().setLocation();
  const location = useLocation();

  return (
    <PageLayout
      pageTitle="Vendors"
      actions={
        <Link to={`${location.pathname}/new`}>
          <Button rightIcon={<RiAddLine />} colorScheme="cyan" size="sm">
            New Vendor
          </Button>
        </Link>
      }
      breadcrumbLinks={{
        Dashboard: '/',
        Vendors: location.pathname,
      }}
    >
      <Vendors />
    </PageLayout>
  );
}

export default VendorsPage;
