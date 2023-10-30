import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';

//
import { mutations } from 'gql';
//hooks
import { useItemFormProps, useToasts } from 'hooks';

import { CREATE_ITEM } from '../../../store/actions/itemsActions';
import { reset } from '../../../store/slices/itemsSlice';

import { ITEMS } from '../../../nav/routes';

import PageLayout from '../../../components/layout/PageLayout';
import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';

import ItemForm from 'components/forms/Item';

import useSavedLocation from '../../../hooks/useSavedLocation';

function NewItemPage(props) {
  const { isModified, action, resetItem } = props;

  const [createItem, { loading, error, called, reset }] = useMutation(
    mutations.vehicles.CREATE_VEHICLE
  );
  const success = called && !loading && !error;
  const failed = called && !loading && Boolean(error);
  console.log({ success, failed });

  console.log({ error });

  const { accounts, taxes, loading: loadingProps } = useItemFormProps();

  const { error: toastError, success: toastSuccess } = useToasts();

  const navigate = useNavigate();
  const location = useLocation();
  useSavedLocation().setLocation();

  // useEffect(() => {
  //   if (isModified) {
  //     resetItem();
  //     navigate(ITEMS);
  //   }
  // }, [isModified, resetItem, navigate]);
  useEffect(() => {
    console.log({ success });
    if (success) {
      toastSuccess('Vehicle created successfully!');
      reset();
      navigate(ITEMS);
    }
  }, [reset, navigate, toastSuccess, success]);

  useEffect(() => {
    if (failed) {
      console.log(error);
      toastError(error.message);
    }
  }, [error, failed, toastError]);

  function handleSubmit(formData) {
    console.log({ formData });
    reset();
    createItem({
      variables: { formData },
      // refetchQueries: [
      //   {
      //     query: 'SearchVehicles',
      //     // fetchPolicy:''
      //   },
      // ],
    });
  }

  return (
    <PageLayout
      pageTitle="New Vehicle"
      breadcrumbLinks={{
        Dashboard: '/',
        Vehicles: ITEMS,
        'New Vehicle': location.pathname,
      }}
    >
      {loadingProps ? (
        <SkeletonLoader />
      ) : accounts && taxes ? (
        <ItemForm
          updating={loading}
          accounts={accounts}
          taxes={taxes}
          handleFormSubmit={handleSubmit}
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
  const { loading, action, error, isModified } = state.itemsReducer;

  return { loading, action, error, isModified };
}

function mapDispatchToProps(dispatch) {
  return {
    createItem: payload => dispatch({ type: CREATE_ITEM, payload }),
    resetItem: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewItemPage);
