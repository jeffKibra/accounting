import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";

import useToasts from "../../../hooks/useToasts";
import { CREATE_ITEM_CATEGORY } from "../../../store/actions/itemsCategoriesActions";
import { reset } from "../../../store/slices/itemsCategories/modifyItemsCategoriesSlice";

import ItemCategoryForm from "../../../components/forms/ItemsCategories/ItemCategoryForm";

function NewItemCategory(props) {
  const { create, loading, isModified, error, resetApp } = props;
  const navigate = useNavigate();
  const toasts = useToasts();
  console.log({ props });

  useEffect(() => {
    if (isModified) {
      toasts.success("Items Category Successfully created!");
      resetApp();
      navigate(-1);
    }
  }, [isModified, resetApp, toasts, navigate]);

  useEffect(() => {
    if (error) {
      toasts.error(error.message);
    }
  }, [error, toasts]);

  return (
    <Box w={350} maxW="90%">
      <ItemCategoryForm handleFormSubmit={create} loading={loading} />
    </Box>
  );
}

function mapStateToProps(state) {
  const { loading, isModified, error } = state.modifyItemsCategoriesReducer;
  return {
    loading,
    isModified,
    error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    create: (payload) => dispatch({ type: CREATE_ITEM_CATEGORY, payload }),
    resetApp: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewItemCategory);
