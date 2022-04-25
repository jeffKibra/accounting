import { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import useToasts from "../../hooks/useToasts";

import { AUTH_LISTENER } from "../../store/actions/authActions";

import FullPageSpinner from "../../components/ui/FullPageSpinner";

export function CheckAuth(props) {
  const { authListener, loading, error, isNewUser, children } = props;
  const toasts = useToasts();

  useEffect(() => {
    authListener();
  }, [authListener]);

  useEffect(() => {
    if (error) {
      toasts.error(error.message);
    }
  }, [error, toasts]);

  return loading && !isNewUser ? <FullPageSpinner /> : children;
}

CheckAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

function mapStateToProps(state) {
  const { loading, userProfile, error, isNewUser } = state.authReducer;
  // console.log({ loading, isNewUser });
  return {
    loading,
    userProfile,
    error,
    isNewUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authListener: () => dispatch({ type: AUTH_LISTENER }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckAuth);
