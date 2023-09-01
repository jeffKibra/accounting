import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

//hooks
import { useItemFormProps } from 'hooks';

import { CREATE_ITEM } from '../../../store/actions/itemsActions';
import { reset } from '../../../store/slices/itemsSlice';

import { ITEMS } from '../../../nav/routes';

import PageLayout from '../../../components/layout/PageLayout';
import SkeletonLoader from 'components/ui/SkeletonLoader';
import Empty from 'components/ui/Empty';

import ItemForm from 'components/forms/Item';

import useSavedLocation from '../../../hooks/useSavedLocation';

function NewItemPage(props) {
  const { isModified, loading, action, createItem, resetItem } = props;

  const { accounts, taxes, loading: loadingProps } = useItemFormProps();

  const navigate = useNavigate();
  const location = useLocation();
  useSavedLocation().setLocation();

  useEffect(() => {
    if (isModified) {
      resetItem();
      navigate(ITEMS);
    }
  }, [isModified, resetItem, navigate]);

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
          updating={loading && action === CREATE_ITEM}
          accounts={accounts}
          taxes={taxes}
          handleFormSubmit={createItem}
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
