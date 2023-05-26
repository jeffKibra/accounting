import { Component } from 'react';
import { connect } from 'react-redux';

import {
  GET_VEHICLES,
  DELETE_VEHICLE,
} from '../../../store/actions/vehiclesActions';
import { reset } from '../../../store/slices/vehiclesSlice';

import Empty from '../../../components/ui/Empty';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';

import VehicleTable from '../../../components/tables/Vehicles/VehiclesTable';

class Vehicles extends Component {
  componentDidMount() {
    this.props.getVehicles();
  }

  componentDidUpdate(prevProps) {
    const { isModified, resetVehicle, getVehicles } = this.props;

    if (isModified) {
      //reset
      resetVehicle();
      //refetch vehicles
      getVehicles();
    }
  }

  render() {
    const { loading, vehicles, action, isModified, deleteVehicle } = this.props;
    // console.log({ vehicles, loading, error });

    return loading && action === GET_VEHICLES ? (
      <SkeletonLoader loading={loading} />
    ) : vehicles && vehicles.length > 0 ? (
      <VehicleTable
        isDeleted={isModified}
        handleDelete={deleteVehicle}
        deleting={loading && action === DELETE_VEHICLE}
        vehicles={vehicles}
      />
    ) : (
      <Empty />
    );
  }
}

function mapStateToProps(state) {
  const { loading, error, vehicles, action, isModified } =
    state.vehiclesReducer;

  return { loading, error, vehicles, action, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    getVehicles: () => dispatch({ type: GET_VEHICLES }),
    deleteVehicle: vehicleId =>
      dispatch({ type: DELETE_VEHICLE, payload: vehicleId }),
    resetVehicle: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Vehicles);
