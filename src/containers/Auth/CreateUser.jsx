import { useEffect } from "react";
import { connect } from "react-redux";

import useToasts from "../../hooks/useToasts";
import { CREATE_USER } from "../../store/actions/authActions";

import CreateAccountForm from "../../components/forms/Auth/CreateAccountForm";

function CreateUser(props) {
  const { loading, error, create } = props;
  const toasts = useToasts();

  useEffect(() => {
    if (error) {
      toasts.error(error.message);
    }
  }, [error, toasts]);

  return <CreateAccountForm handleFormSubmit={create} loading={loading} />;
}

function mapStateToProps(state) {
  const { loading, error } = state.authReducer;

  return {
    loading,
    error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    create: (data) => dispatch({ type: CREATE_USER, data }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateUser);
