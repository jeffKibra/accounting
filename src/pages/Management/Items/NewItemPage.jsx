import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { CREATE_ITEM } from '../../../store/actions/itemsActions';
import { reset } from '../../../store/slices/itemsSlice';

import { ITEMS } from '../../../nav/routes';

import PageLayout from '../../../components/layout/PageLayout';
import ItemForm from 'components/forms/ItemForm';

import useSavedLocation from '../../../hooks/useSavedLocation';

function NewItemPage(props) {
  const { isModified, loading, action, createItem, resetItem } = props;

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
      pageTitle="Add New Item"
      breadcrumbLinks={{
        Dashboard: '/',
        Items: ITEMS,
        'New Item': location.pathname,
      }}
    >
      <ItemForm
        updating={loading && action === CREATE_ITEM}
        handleFormSubmit={createItem}
      />
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
