import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { connect } from "react-redux";
import { RiCloseLine } from "react-icons/ri";
import { IconButton } from "@chakra-ui/react";

import { ITEMS } from "../../../nav/routes";

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
      actions={
        <Link to={ITEMS}>
          <IconButton
            colorScheme="red"
            variant="outline"
            size="sm"
            title="cancel"
            icon={<RiCloseLine />}
          />
        </Link>
      }
    >
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
    updateItem: (payload) => dispatch({ type: UPDATE_ITEM, payload }),
    getItem: (itemId) => dispatch({ type: GET_ITEM, payload: itemId }),
    resetItem: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditItemPage);
