import { Button } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { RiAddLine } from 'react-icons/ri';

import useSavedLocation from '../../../hooks/useSavedLocation';

import PageLayout from '../../../components/layout/PageLayout';
import Vehices from '../../../containers/Management/Vehicles/Vehicles';

function VehicesPage() {
  const location = useLocation();
  useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="Vehices List"
      actions={
        <Link to={`${location.pathname}/new`}>
          <Button leftIcon={<RiAddLine />} colorScheme="cyan" size="sm">
            New Vehicle
          </Button>
        </Link>
      }
      breadcrumbLinks={{
        Dashboard: '/',
        Vehices: location.pathname,
      }}
    >
      <Vehices />
    </PageLayout>
  );
}

export default VehicesPage;
