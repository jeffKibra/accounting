import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { CREATE_CAR_MODEL } from '../../../store/actions/carModelsActions';
import { reset } from '../../../store/slices/carModelsSlice';

import { CAR_MODELS } from '../../../nav/routes';

import PageLayout from '../../../components/layout/PageLayout';

import ItemForm from 'components/forms/CarModel';

import useSavedLocation from '../../../hooks/useSavedLocation';

function NewCarModelPage(props) {
  const { isModified, loading, action, createCarModel, resetCarModel } = props;

  const navigate = useNavigate();
  const location = useLocation();
  useSavedLocation().setLocation();

  useEffect(() => {
    if (isModified) {
      resetCarModel();
      navigate(CAR_MODELS);
    }
  }, [isModified, resetCarModel, navigate]);

  return (
    <PageLayout
      pageTitle="New Car Model"
      breadcrumbLinks={{
        Dashboard: '/',
        'Car Models': CAR_MODELS,
        'New Model': location.pathname,
      }}
    >
      <ItemForm
        updating={loading && action === CREATE_CAR_MODEL}
        handleFormSubmit={createCarModel}
      />
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, action, error, isModified } = state.carModelsReducer;

  return { loading, action, error, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createCarModel: payload => dispatch({ type: CREATE_CAR_MODEL, payload }),
    resetCarModel: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewCarModelPage);
