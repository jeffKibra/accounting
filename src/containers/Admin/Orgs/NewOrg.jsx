import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import { modifyOrgsReset } from "../../../store/slices/orgs/modifyOrgsSlice";
import { CREATE_ORG } from "../../../store/actions/orgsActions";

import useToasts from "../../../hooks/useToasts";

import OrgForm from "../../../components/forms/Orgs/OrgForm";

function NewOrg(props) {
  const { loading, isModified, error, createOrg, reset } = props;
  const toasts = useToasts();
  const navigate = useNavigate();

  useEffect(() => {
    if (isModified) {
      reset();
      toasts.success("Orgnization successfully created!");
      navigate(-1);
    }
  }, [isModified, reset, navigate, toasts]);

  useEffect(() => {
    if (error) {
      toasts.error(error.message);
    }
  }, [error, toasts]);

  return (
    <div>
      <OrgForm loading={loading} onFormSubmit={createOrg} />
    </div>
  );
}

function mapStateToProps(state) {
  const { loading, isModified, error } = state.modifyOrgsReducer;

  return {
    loading,
    isModified,
    error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createOrg: (data) => dispatch({ type: CREATE_ORG, data }),
    reset: () => dispatch(modifyOrgsReset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewOrg);
