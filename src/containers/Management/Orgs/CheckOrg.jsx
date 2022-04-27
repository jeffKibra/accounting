import { Component } from "react";
import { connect } from "react-redux";

import { CHECK_ORG } from "../../../store/actions/orgsActions";

import FullPageSpinner from "../../../components/ui/FullPageSpinner";

class CheckOrg extends Component {
  componentDidMount() {
    this.props.check();
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

  return { loading, org, action };
}

function mapDispatchToProps(dispatch) {
  return {
    check: () => dispatch({ type: CHECK_ORG }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckOrg);
