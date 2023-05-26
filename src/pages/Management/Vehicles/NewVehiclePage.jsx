import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

//hooks
import { useVehicleFormProps } from 'hooks';

import { CREATE_VEHICLE } from '../../../store/actions/vehiclesActions';
import { reset } from '../../../store/slices/vehiclesSlice';

import { VEHICLES } from '../../../nav/routes';

import PageLayout from '../../../components/layout/PageLayout';
import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';

import VehicleForm from 'components/forms/Vehicle';

import useSavedLocation from '../../../hooks/useSavedLocation';

function NewVehiclePage(props) {
  const { isModified, loading, action, createVehicle, resetVehicle } = props;

  const { accounts, taxes, loading: loadingProps } = useVehicleFormProps();

  const navigate = useNavigate();
  const location = useLocation();
  useSavedLocation().setLocation();

  useEffect(() => {
    if (isModified) {
      resetVehicle();
      navigate(VEHICLES);
    }
  }, [isModified, resetVehicle, navigate]);

  return (
    <PageLayout
      pageTitle="Add New Vehicle"
      breadcrumbLinks={{
        Dashboard: '/',
        Vehicles: VEHICLES,
        'New Vehicle': location.pathname,
      }}
    >
      {loadingProps ? (
        <SkeletonLoader />
      ) : accounts && taxes ? (
        <VehicleForm
          updating={loading && action === CREATE_VEHICLE}
          accounts={accounts}
          taxes={taxes}
          handleFormSubmit={createVehicle}
        />
      ) : (
        <>
          <Empty
            message={
              !accounts ? 'Accounts data not found!' : 'Taxes Data not found!'
            }
          />
        </>
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, error, isModified } = state.vehiclesReducer;

  return { loading, action, error, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createVehicle: payload => dispatch({ type: CREATE_VEHICLE, payload }),
    resetVehicle: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewVehiclePage);
