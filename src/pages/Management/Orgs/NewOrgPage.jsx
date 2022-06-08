import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { isAdmin } from "../../../utils/roles";

import { reset } from "../../../store/slices/orgsSlice";
import { CREATE_ORG } from "../../../store/actions/orgsActions";

import useAuth from "../../../hooks/useAuth";

import EditOrg from "../../../containers/Management/Orgs/EditOrg";

function NewOrgPage(props) {
  const { loading, isModified, action, createOrg, resetOrg } = props;
  const navigate = useNavigate();
  const userProfile = useAuth();

  useEffect(() => {
    if (isModified) {
      resetOrg();
      navigate(-1);
    }
  }, [isModified, resetOrg, navigate]);

  return (
    <EditOrg
      isAdmin={isAdmin(userProfile?.role)}
      loading={loading && action === CREATE_ORG}
      saveData={createOrg}
    />
  );
}

function mapStateToProps(state) {
  const { loading, isModified, action } = state.orgsReducer;

  return {
    loading,
    isModified,
    action,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createOrg: (data) => dispatch({ type: CREATE_ORG, data }),
    resetOrg: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewOrgPage);
