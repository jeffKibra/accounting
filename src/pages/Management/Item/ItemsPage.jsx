import { Button, Box } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { RiAddLine } from 'react-icons/ri';

import useSavedLocation from '../../../hooks/useSavedLocation';

import PageLayout from '../../../components/layout/PageLayout';
// import Items from '../../../containers/Management/Items/Items';
import ItemsTable from 'components/tables/Items/ItemsTable';

function ItemsPage() {
  const location = useLocation();
  useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="Vehicles List"
      actions={
        <Link to={`${location.pathname}/new`}>
          <Button leftIcon={<RiAddLine />} colorScheme="cyan" size="sm">
            New
          </Button>
        </Link>
      }
      breadcrumbLinks={{
        Dashboard: '/',
        Vehicles: location.pathname,
      }}
    >
      <Box shadow="lg" bg="white" py={4} borderRadius="lg" w="full">
        <ItemsTable enableActions />
      </Box>
    </PageLayout>
  );
}

export default ItemsPage;
