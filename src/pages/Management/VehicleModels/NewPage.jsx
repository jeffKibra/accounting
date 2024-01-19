import { useLocation } from 'react-router-dom';

//
import { useCreateVehicleModel } from 'hooks';
//

import { VEHICLE_MODELS } from '../../../nav/routes';

import PageLayout from '../../../components/layout/PageLayout';

import VehicleModelForm from 'components/forms/VehicleModel';

function NewVehicleModelPage() {
  const { loading, createVehicleModel } = useCreateVehicleModel();

  const location = useLocation();

  return (
    <PageLayout
      pageTitle="New Vehicle Model"
      breadcrumbLinks={{
        Dashboard: '/',
        Models: VEHICLE_MODELS,
        'New Model': location.pathname,
      }}
    >
      <VehicleModelForm updating={loading} onSubmit={createVehicleModel} />
    </PageLayout>
  );
}

export default NewVehicleModelPage;
