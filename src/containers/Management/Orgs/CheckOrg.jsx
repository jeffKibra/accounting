import { Component } from "react";
import { connect } from "react-redux";

import { CHECK_ORG } from "../../../store/actions/orgsActions";

import FullPageSpinner from "../../../components/ui/FullPageSpinner";

class CheckOrg extends Component {
  componentDidMount() {
    const { check, userProfile } = this.props;

    if (userProfile) {
      check();
    }
  }

  componentDidUpdate(prevProps) {
    const { userProfile, check } = this.props;

    if (userProfile && !prevProps.userProfile) {
      check();
    }
  }

  render() {
    const { loading, children, action } = this.props;

    return loading && action === CHECK_ORG ? (
      <FullPageSpinner label="Loading Details..." />
    ) : (
      children
    );
  }
}

function mapStateToProps(state) {
  const { loading, org, action } = state.orgsReducer;
  const { userProfile } = state.authReducer;

  return { loading, org, action, userProfile };
}

function mapDispatchToProps(dispatch) {
  return {
    check: () => dispatch({ type: CHECK_ORG }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckOrg);
