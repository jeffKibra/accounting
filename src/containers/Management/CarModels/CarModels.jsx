import { Component } from 'react';
import { connect } from 'react-redux';
import { Box } from '@chakra-ui/react';

import ControlledSelect from 'components/ui/ControlledSelect';

import {
  GET_CAR_MODELS,
  DELETE_CAR_MODEL,
} from '../../../store/actions/carModelsActions';
import { reset } from '../../../store/slices/carModelsSlice';

import Empty from '../../../components/ui/Empty';
import SkeletonLoader from '../../../components/ui/SkeletonLoader';

import CarModelTable from '../../../components/tables/CarModels';

class CarModels extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCarMake: '',
      selectedCarModels: [],
    };

    this.handleCarMakeChange = this.handleCarMakeChange.bind(this);
  }

  updateSelectedCarMake = carMake => {
    const carModels = this.props.carModels || {};
    const selectedCarModels = carModels[carMake] || [];
    console.log({ selectedCarModels: selectedCarModels });

    this.setState({
      selectedCarMake: carMake,
      selectedCarModels,
    });
  };

  componentDidMount() {
    this.props.getCarModels();
    this.updateSelectedCarMake('Toyota');
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

  handleCarMakeChange(incomingValue) {
    console.log({ incomingValue: incomingValue });

    this.updateSelectedCarMake(incomingValue);
  }

  render() {
    console.log({ state: this.state });
    const { selectedCarModels, selectedCarMake } = this.state;
    const { loading, carMakes, carModels, action, isModified, deleteCarModel } =
      this.props;
    // console.log({ carModel, loading, error });

    return loading && action === GET_CAR_MODELS ? (
      <SkeletonLoader loading={loading} />
    ) : carMakes && carMakes?.length > 0 && carModels ? (
      <Box w="full">
        <Box mb={3}>
          <ControlledSelect
            options={carMakes.map(make => ({ name: make, value: make }))}
            onChange={this.handleCarMakeChange}
            value={selectedCarMake}
            placeholder="Select Car Make"
          />
        </Box>

        <CarModelTable
          isDeleted={isModified}
          handleDelete={deleteCarModel}
          deleting={loading && action === DELETE_CAR_MODEL}
          carModels={selectedCarModels}
        />
      </Box>
    ) : (
      <Empty />
    );
  }
}

function mapStateToProps(state) {
  const carModelsState = state.carModelsReducer;
  console.log({ state, carModelsState });
  const { loading, error, carModels, carMakes, action, isModified } =
    carModelsState;

  return {
    loading,
    error,
    carMakes,
    carModels,
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
