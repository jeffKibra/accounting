import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import useSavedLocation from "../../../hooks/useSavedLocation";

import PageLayout from "../../../components/layout/PageLayout";

import EditItem from "../../../containers/Management/Items/EditItem";

import { GET_ITEM, UPDATE_ITEM } from "../../../store/actions/itemsActions";
import { reset } from "../../../store/slices/itemsSlice";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

function EditItemPage(props) {
  const { getItem, updateItem, resetItem, loading, isModified, action, item } =
    props;
  useSavedLocation().setLocation();

  const { itemId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getItem(itemId);
  }, [getItem, itemId]);

  useEffect(() => {
    if (isModified) {
      resetItem();
      navigate("/items");
    }
  }, [isModified, resetItem, navigate]);

  function handleSubmit(data) {
    // console.log({ data });
    updateItem({
      ...data,
      itemId,
    });
  }

  return (
    <PageLayout pageTitle="Edit Item">
      {loading && action === GET_ITEM ? (
        <SkeletonLoader />
      ) : item ? (
        (() => {
          const { createdAt, modifiedAt, createdBy, modifiedBy, ...rest } =
            item;
          return (
            <EditItem
              updating={loading && action === UPDATE_ITEM}
              item={rest}
              saveData={handleSubmit}
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
    updateItem: (data) => dispatch({ type: UPDATE_ITEM, data }),
    getItem: (itemId) => dispatch({ type: GET_ITEM, itemId }),
    resetItem: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditItemPage);
