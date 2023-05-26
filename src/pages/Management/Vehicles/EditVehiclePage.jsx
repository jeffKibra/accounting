import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import { VEHICLES } from '../../../nav/routes';

import { useSavedLocation, useVehicleFormProps } from 'hooks';

import PageLayout from '../../../components/layout/PageLayout';

import VehicleForm from 'components/forms/Vehicle';

import {
  GET_VEHICLE,
  UPDATE_VEHICLE,
} from '../../../store/actions/vehiclesActions';
import { reset } from '../../../store/slices/vehiclesSlice';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

function EditVehiclePage(props) {
  const {
    getVehicle,
    updateVehicle,
    resetVehicle,
    loading,
    isModified,
    action,
    vehicle,
  } = props;
  useSavedLocation().setLocation();
  const { accounts, taxes, loading: loadingFormProps } = useVehicleFormProps();

  const location = useLocation();
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getVehicle(vehicleId);
  }, [getVehicle, vehicleId]);

  useEffect(() => {
    if (isModified) {
      resetVehicle();
      navigate(VEHICLES);
    }
  }, [isModified, resetVehicle, navigate]);

  function handleSubmit(data) {
    if (Object.keys(data).length === 0) {
      //no form data has been changed. redirect to VEHICLES page
      return navigate(VEHICLES);
    }

    updateVehicle({
      ...data,
      vehicleId,
    });
  }

  return (
    <PageLayout
      pageTitle="Edit Vehicle"
      breadcrumbLinks={{
        Dashboard: '/',
        Vehicles: VEHICLES,
        [vehicleId]: location.pathname,
      }}
    >
      {(loading && action === GET_VEHICLE) || loadingFormProps ? (
        <SkeletonLoader />
      ) : vehicle && accounts ? (
        (() => {
          const { createdAt, modifiedAt, createdBy, modifiedBy, ...rest } =
            vehicle;
          return (
            <VehicleForm
              updating={loading && action === UPDATE_VEHICLE}
              vehicle={rest}
              handleFormSubmit={handleSubmit}
              accounts={accounts}
              taxes={taxes || []}
            />
          );
        })()
      ) : (
        <Empty
          message={
            !vehicle ? 'vehicle Data not found!' : 'Accounts data missing!'
          }
        />
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
    updateVehicle: payload => dispatch({ type: UPDATE_VEHICLE, payload }),
    getVehicle: vehicleId =>
      dispatch({ type: GET_VEHICLE, payload: vehicleId }),
    resetVehicle: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditVehiclePage);
