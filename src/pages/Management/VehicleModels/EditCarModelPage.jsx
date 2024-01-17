import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import { CAR_MODELS } from '../../../nav/routes';

import { useSavedLocation } from 'hooks';

import PageLayout from '../../../components/layout/PageLayout';

import CarModelForm from 'components/forms/CarModel';

import {
  GET_CAR_MODEL,
  UPDATE_CAR_MODEL,
} from '../../../store/actions/carModelsActions';
import { reset } from '../../../store/slices/carModelsSlice';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

function EditCarModelPage(props) {
  // console.log({ props });
  const {
    getCarModel,
    updateCarModel,
    resetCarModel,
    loading,
    isModified,
    action,
    carModel,
  } = props;

  useSavedLocation().setLocation();

  const location = useLocation();
  const { modelId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getCarModel(modelId);
  }, [getCarModel, modelId]);

  useEffect(() => {
    if (isModified) {
      resetCarModel();
      navigate(CAR_MODELS);
    }
  }, [isModified, resetCarModel, navigate]);

  function handleSubmit(data) {
    if (Object.keys(data).length === 0) {
      //no form data has been changed. redirect to CAR_MODELS page
      return navigate(CAR_MODELS);
    }

    updateCarModel({
      ...data,
      modelId,
    });
  }

  return (
    <PageLayout
      pageTitle="Edit Car Model"
      breadcrumbLinks={{
        Dashboard: '/',
        'Car Models': CAR_MODELS,
        [modelId]: location.pathname,
      }}
    >
      {loading && action === GET_CAR_MODEL ? (
        <SkeletonLoader />
      ) : carModel ? (
        (() => {
          const { createdAt, modifiedAt, createdBy, modifiedBy, ...rest } =
            carModel;
          return (
            <CarModelForm
              updating={loading && action === UPDATE_CAR_MODEL}
              carModel={rest}
              handleFormSubmit={handleSubmit}
            />
          );
        })()
      ) : (
        <Empty message="Car Model Data not found!" />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, isModified, action, carModel } = state.carModelsReducer;

  return { loading, isModified, action, carModel };
}

function mapDispatchToProps(dispatch) {
  return {
    updateCarModel: payload => dispatch({ type: UPDATE_CAR_MODEL, payload }),
    getCarModel: modelId => dispatch({ type: GET_CAR_MODEL, payload: modelId }),
    resetCarModel: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCarModelPage);
