import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

import { ITEMS } from '../../../nav/routes';

import useSavedLocation from '../../../hooks/useSavedLocation';

import PageLayout from '../../../components/layout/PageLayout';

import ItemForm from 'components/forms/ItemForm';

import { GET_ITEM, UPDATE_ITEM } from '../../../store/actions/itemsActions';
import { reset } from '../../../store/slices/itemsSlice';

import SkeletonLoader from '../../../components/ui/SkeletonLoader';
import Empty from '../../../components/ui/Empty';

function EditItemPage(props) {
  const { getItem, updateItem, resetItem, loading, isModified, action, item } =
    props;
  useSavedLocation().setLocation();

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
      //no form data has been changed. redirect to items page
      return navigate(ITEMS);
    }

    updateItem({
      ...data,
      itemId,
    });
  }

  return (
    <PageLayout
      pageTitle="Edit Item"
      breadcrumbLinks={{
        Dashboard: '/',
        Items: ITEMS,
        [itemId]: location.pathname,
      }}
    >
      {loading && action === GET_ITEM ? (
        <SkeletonLoader />
      ) : item ? (
        (() => {
          const { createdAt, modifiedAt, createdBy, modifiedBy, ...rest } =
            item;
          return (
            <ItemForm
              updating={loading && action === UPDATE_ITEM}
              item={rest}
              handleFormSubmit={handleSubmit}
            />
          );
        })()
      ) : (
        <Empty message="Item Data not found!" />
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
