import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { GET_ITEM, UPDATE_ITEM } from "../../../store/actions/itemsActions";
import { reset } from "../../../store/slices/itemsSlice";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";
import ItemForm from "../../../components/forms/Items/ItemForm";

function EditItem(props) {
  const { getItem, updateItem, resetItem, loading, isModified, action, item } =
    props;
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

  return loading && action === GET_ITEM ? (
    <SkeletonLoader />
  ) : item ? (
    (() => {
      const { createdAt, modifiedAt, createdBy, modifiedBy, ...rest } = item;
      return (
        <ItemForm
          loading={loading && action === UPDATE_ITEM}
          item={rest}
          handleFormSubmit={handleSubmit}
        />
      );
    })()
  ) : (
    <Empty message="Item Data not found!" />
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

export default connect(mapStateToProps, mapDispatchToProps)(EditItem);
