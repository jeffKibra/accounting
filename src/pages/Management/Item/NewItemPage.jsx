import { connect } from 'react-redux';
import {  useLocation } from 'react-router-dom';

//
//hooks
import { useCreateVehicle } from 'hooks';

import { CREATE_ITEM } from '../../../store/actions/itemsActions';
import { reset } from '../../../store/slices/itemsSlice';

import { ITEMS } from '../../../nav/routes';

import PageLayout from '../../../components/layout/PageLayout';
import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';

import ItemForm from 'components/forms/Item';

function NewItemPage(props) {
  const { createVehicle, loading, loadingProps, taxes } = useCreateVehicle();

  const location = useLocation();

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
      ) : taxes ? (
        <ItemForm
          updating={loading}
          // accounts={accounts}
          taxes={taxes}
          onSubmit={createVehicle}
        />
      ) : (
        <>
          <Empty message={'Taxes Data not found!'} />
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
