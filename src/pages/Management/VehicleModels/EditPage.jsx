import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { VEHICLE_MODELS } from '../../../nav/routes';

import PageLayout from '../../../components/layout/PageLayout';

import VehicleModelForm from 'components/forms/VehicleModel';

import { useUpdateVehicleModel } from 'hooks';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

function EditVehicleModelPage(props) {
  // console.log({ props });

  const location = useLocation();
  const { modelId, make } = useParams();
  const navigate = useNavigate();

  console.log({ make, modelId });

  const { loading, vehicleModel, updating, updateVehicleModel } =
    useUpdateVehicleModel(make, modelId);

  const vehicleModelsPath = `${VEHICLE_MODELS}?make=${make}`;

  function handleSubmit(data) {
    console.log({ data });
    if (Object.keys(data).length === 0) {
      //no form data has been changed. redirect to VEHICLE_MODELS page
      return navigate(vehicleModelsPath);
    }

    return updateVehicleModel({
      ...data,
    });
  }

  return (
    <PageLayout
      pageTitle="Edit Vehicle Model"
      breadcrumbLinks={{
        Dashboard: '/',
        Models: vehicleModelsPath,
        [modelId]: location,
      }}
    >
      {loading ? (
        <SkeletonLoader />
      ) : vehicleModel ? (
        <VehicleModelForm
          updating={updating}
          vehicleModel={vehicleModel}
          onSubmit={handleSubmit}
        />
      ) : (
        <Empty message="Vehicle Model Data not found!" />
      )}
    </PageLayout>
  );
}

export default EditVehicleModelPage;
