import { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import { CREATE_ITEM } from "../../../store/actions/itemsActions";
import { reset } from "../../../store/slices/itemsSlice";

import { ITEMS } from "../../../nav/routes";

import PageLayout from "../../../components/layout/PageLayout";
import EditItem from "../../../containers/Management/Items/EditItem";

import useSavedLocation from "../../../hooks/useSavedLocation";

function NewItemPage(props) {
  const { isModified, loading, action, createItem, resetItem } = props;

  const navigate = useNavigate();
  useSavedLocation().setLocation();

  useEffect(() => {
    if (isModified) {
      resetItem();
      navigate(ITEMS);
    }
  }, [isModified, resetItem, navigate]);

  return (
    <PageLayout pageTitle="Add New Item">
      <EditItem
        updating={loading && action === CREATE_ITEM}
        saveData={createItem}
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
    createItem: (data) => dispatch({ type: CREATE_ITEM, data }),
    resetItem: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewItemPage);
