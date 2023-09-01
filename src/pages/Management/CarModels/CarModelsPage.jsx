// import { Button } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
// import { RiAddLine } from 'react-icons/ri';

import useSavedLocation from '../../../hooks/useSavedLocation';

import PageLayout from '../../../components/layout/PageLayout';
import CarModels from '../../../containers/Management/CarModels/CarModels';

function CarModelsPage() {
  const location = useLocation();
  useSavedLocation().setLocation();

  return (
    <PageLayout
      pageTitle="Car Models"
      // actions={
      //   <Link to={`${location.pathname}/new`}>
      //     <Button leftIcon={<RiAddLine />} colorScheme="cyan" size="sm">
      //       New Model
      //     </Button>
      //   </Link>
      // }
      breadcrumbLinks={{
        Dashboard: '/',
        'Car Models': location.pathname,
      }}
    >
      <CarModels />
    </PageLayout>
  );
}

export default CarModelsPage;
