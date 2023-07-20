import { Component } from 'react';
import { connect } from 'react-redux';

import {
  GET_CAR_MODELS,
  DELETE_CAR_MODEL,
} from '../../../store/actions/carModelsActions';
import { reset } from '../../../store/slices/carModelsSlice';

import Empty from '../../../components/ui/Empty';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';

import CarModelTable from '../../../components/tables/CarModels';

class CarModels extends Component {
  componentDidMount() {
    this.props.getCarModels();
  }

  componentDidUpdate(prevProps) {
    const { isModified, resetCarModel, getCarModels } = this.props;

    if (isModified) {
      //reset
      resetCarModel();
      //refetch carModel
      getCarModels();
    }
  }

  render() {
    const { loading, carModels, action, isModified, deleteCarModel } =
      this.props;
    // console.log({ carModel, loading, error });

    return loading && action === GET_CAR_MODELS ? (
      <SkeletonLoader loading={loading} />
    ) : carModels && carModels.length > 0 ? (
      <CarModelTable
        isDeleted={isModified}
        handleDelete={deleteCarModel}
        deleting={loading && action === DELETE_CAR_MODEL}
        carModels={carModels}
      />
    ) : (
      <Empty />
    );
  }
}

function mapStateToProps(state) {
  const carModelsState = state.carModelsReducer;
  // console.log({ state, carModelsState });
  const { loading, error, carModels, action, isModified } = carModelsState;

  return {
    loading,
    error,
    carModels: carModels ? Object.values(carModels) : carModels,
    action,
    isModified,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCarModels: () => dispatch({ type: GET_CAR_MODELS }),
    deleteCarModel: itemId =>
      dispatch({ type: DELETE_CAR_MODEL, payload: itemId }),
    resetCarModel: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CarModels);
