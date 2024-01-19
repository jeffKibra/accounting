import { Link } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { RiAddLine } from 'react-icons/ri';

import PageLayout from '../../../components/layout/PageLayout';
import CarModels from '../../../containers/Management/VehicleModels/List';
//

function VehicleModelsPage() {
  const { pathname } = useLocation();

  // const { loading, vehicleMakes } = useListVehicleMakes();
  // console.log({ loading, vehicleMakes });

  return (
    <PageLayout
      pageTitle="Vehicle Models"
      actions={
        <Link to={`${pathname}/new`}>
          <Button leftIcon={<RiAddLine />} colorScheme="cyan" size="sm">
            New
          </Button>
        </Link>
      }
      breadcrumbLinks={{
        Dashboard: '/',
        Models: pathname,
      }}
    >
      <CarModels />
    </PageLayout>
  );
}

export default VehicleModelsPage;
