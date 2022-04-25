import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { reset } from "../../../store/slices/blogsSlice";
import { CREATE_BLOG } from "../../../store/actions/blogsActions";

import useToasts from "../../../hooks/useToasts";

import BlogForm from "../../../components/forms/Blogs/BlogForm";

function NewBlog(props) {
  const { loading, isModified, error, createOrg, resetBlog } = props;
  const toasts = useToasts();
  const navigate = useNavigate();

  useEffect(() => {
    if (isModified) {
      resetBlog();
      toasts.success("Blog successfully created!");
      navigate(-1);
    }
  }, [isModified, resetBlog, navigate, toasts]);

  useEffect(() => {
    if (error) {
      toasts.error(error.message);
    }
  }, [error, toasts]);

  return <BlogForm loading={loading} onFormSubmit={createOrg} />;
}

function mapStateToProps(state) {
  const { loading, isModified, error } = state.blogsReducer;

  return {
    loading,
    isModified,
    error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createOrg: (data) => dispatch({ type: CREATE_BLOG, data }),
    resetBlog: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewBlog);
