import { useEffect } from "react";
import { connect } from "react-redux";

import { LOGOUT } from "../../store/actions/authActions";

import FullPageSpinner from "../../components/ui/FullPageSpinner";

function Logout(props) {
  const { userProfile, signout } = props;

  useEffect(() => {
    if (userProfile?.email) {
      signout();
    }
  }, [signout, userProfile]);

  return <FullPageSpinner label="SIGNING OUT..." />;
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
