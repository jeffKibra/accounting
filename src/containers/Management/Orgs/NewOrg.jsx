import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { isAdmin } from "../../../utils/roles";

import { reset } from "../../../store/slices/orgsSlice";
import { CREATE_ORG } from "../../../store/actions/orgsActions";

import useAuth from "../../../hooks/useAuth";
import useToasts from "../../../hooks/useToasts";

import OrgForm from "../../../components/forms/Orgs/OrgForm";

function NewOrg(props) {
  const { loading, isModified, error, createOrg, resetOrg } = props;
  const toasts = useToasts();
  const navigate = useNavigate();
  const userProfile = useAuth();

  useEffect(() => {
    if (isModified) {
      resetOrg();
      toasts.success("Orgnization successfully created!");
      navigate(-1);
    }
  }, [isModified, resetOrg, navigate, toasts]);

  useEffect(() => {
    if (error) {
      toasts.error(error.message);
    }
  }, [error, toasts]);

  return (
    <OrgForm
      isAdmin={isAdmin(userProfile?.role)}
      loading={loading}
      onFormSubmit={createOrg}
    />
  );
}

function mapStateToProps(state) {
  const { loading, isModified, error } = state.orgsReducer;

  return {
    loading,
    isModified,
    error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createOrg: (payload) => dispatch({ type: CREATE_ORG, payload }),
    resetOrg: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewOrg);
