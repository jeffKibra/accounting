import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { connect } from 'react-redux';

//
import { GET_VEHICLE } from 'store/actions/vehiclesActions';
//
import { VEHICLES } from 'nav/routes';
//
import PageLayout from 'components/layout/PageLayout';
import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';
//
import useSavedLocation from '../../../hooks/useSavedLocation';
//
import ViewVehicle from 'containers/Management/Vehicles/ViewVehicle';

function ViewVehiclePage(props) {
  const { getVehicle, loading, vehicle } = props;

  const { vehicleId } = useParams();

  const location = useLocation();
  useSavedLocation().setLocation();

  useEffect(() => {
    getVehicle(vehicleId);
  }, [getVehicle, vehicleId]);

  return (
    <PageLayout
      pageTitle="Vehicles Details"
      //   actions={
      //     <Link to={`${location.pathname}/new`}>
      //       <Button leftIcon={<RiAddLine />} colorScheme="cyan" size="sm">
      //         New vehicle
      //       </Button>
      //     </Link>
      //   }
      breadcrumbLinks={{
        Dashboard: '/',
        Vehicles: VEHICLES,
        [vehicleId]: location.pathname,
      }}
    >
      {loading ? (
        <SkeletonLoader />
      ) : vehicle ? (
        <ViewVehicle vehicle={vehicle} />
      ) : (
        <Empty message={'vehicle Data not found!'} />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, isModified, action, vehicle } = state.vehiclesReducer;

  return { loading, isModified, action, vehicle };
}

function mapDispatchToProps(dispatch) {
  return {
    getVehicle: vehicleId =>
      dispatch({ type: GET_VEHICLE, payload: vehicleId }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewVehiclePage);
