import { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { CHECK_ACCOUNTS } from "../../../store/actions/accountsActions";

import FullPageSpinner from "../../../components/ui/FullPageSpinner";

function CheckAccounts(props) {
  const { check, loading, action, orgId, children } = props;

  useEffect(() => {
    if (orgId) {
      check();
    }
  }, [orgId, check]);

  return loading && action === CHECK_ACCOUNTS ? (
    <FullPageSpinner label="Loading Data..." />
  ) : (
    children
  );
}

CheckAccounts.propTypes = {
  children: PropTypes.node.isRequired,
};

function mapStateToProps(state) {
  const orgId = state.orgsReducer.org?.orgId;
  const { loading, action } = state.accountsReducer;

  return {
    loading,
    action,
    orgId,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    check: () => dispatch({ type: CHECK_ACCOUNTS }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckAccounts);
