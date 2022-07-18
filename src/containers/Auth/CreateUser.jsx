import { useEffect } from "react";
import { connect } from "react-redux";

import useToasts from "../../hooks/useToasts";
import { CREATE_USER } from "../../store/actions/authActions";

import CreateAccountForm from "../../components/forms/Auth/CreateAccountForm";

function CreateUser(props) {
  const { loading, error, create, action } = props;
  const toasts = useToasts();

  useEffect(() => {
    if (error) {
      toasts.error(error.message);
    }
  }, [error, toasts]);

  return (
    <CreateAccountForm
      handleFormSubmit={create}
      loading={loading && action === CREATE_USER}
    />
  );
}

function mapStateToProps(state) {
  const { loading, error, action } = state.authReducer;

  return {
    loading,
    error,
    action,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    create: (payload) => dispatch({ type: CREATE_USER, payload }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);
