import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { LOGOUT } from '../../store/actions/authActions';
import { LOGIN_USER } from 'nav/routes';

import FullPageSpinner from '../../components/ui/FullPageSpinner';

function Logout(props) {
  const { userProfile, signout } = props;

  const email = userProfile?.email;

  useEffect(() => {
    if (email) {
      signout();
    }
  }, [signout, email]);

  return email ? (
    <FullPageSpinner label="SIGNING OUT..." />
  ) : (
    <Navigate to={LOGIN_USER} />
  );
}

function mapStateToProps(state) {
  const { userProfile } = state.authReducer;
  return {
    userProfile,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    signout: () => dispatch({ type: LOGOUT }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
