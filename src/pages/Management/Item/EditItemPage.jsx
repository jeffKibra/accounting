import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import { ITEMS } from '../../../nav/routes';

import { useSavedLocation, useItemFormProps } from 'hooks';

import PageLayout from '../../../components/layout/PageLayout';

import ItemForm from 'components/forms/Item';

import { GET_ITEM, UPDATE_ITEM } from '../../../store/actions/itemsActions';
import { reset } from '../../../store/slices/itemsSlice';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

function EditItemPage(props) {
  console.log({ props });
  const { getItem, updateItem, resetItem, loading, isModified, action, item } =
    props;
  useSavedLocation().setLocation();
  const { accounts, taxes, loading: loadingFormProps } = useItemFormProps();

  const location = useLocation();
  const { itemId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getItem(itemId);
  }, [getItem, itemId]);

  useEffect(() => {
    if (isModified) {
      resetItem();
      navigate(ITEMS);
    }
  }, [isModified, resetItem, navigate]);

  function handleSubmit(data) {
    if (Object.keys(data).length === 0) {
      //no form data has been changed. redirect to ITEMS page
      return navigate(ITEMS);
    }

    updateItem({
      ...data,
      itemId,
    });
  }

  return (
    <PageLayout
      pageTitle="Edit Vehicle"
      breadcrumbLinks={{
        Dashboard: '/',
        Vehicles: ITEMS,
        [itemId]: location.pathname,
      }}
    >
      {(loading && action === GET_ITEM) || loadingFormProps ? (
        <SkeletonLoader />
      ) : item && accounts ? (
        (() => {
          const { createdAt, modifiedAt, createdBy, modifiedBy, ...rest } =
            item;
          return (
            <ItemForm
              updating={loading && action === UPDATE_ITEM}
              item={rest}
              handleFormSubmit={handleSubmit}
              accounts={accounts}
              taxes={taxes || []}
            />
          );
        })()
      ) : (
        <Empty
          message={!item ? 'vehicle Data not found!' : 'Accounts data missing!'}
        />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, isModified, action, item } = state.itemsReducer;

  return { loading, isModified, action, item };
}

function mapDispatchToProps(dispatch) {
  return {
    updateItem: payload => dispatch({ type: UPDATE_ITEM, payload }),
    getItem: itemId => dispatch({ type: GET_ITEM, payload: itemId }),
    resetItem: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditItemPage);
