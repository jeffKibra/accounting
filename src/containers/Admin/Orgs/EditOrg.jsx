import { useEffect } from "react";
import { connect } from "react-redux";
import { SkeletonText } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import { modifyOrgsReset } from "../../../store/slices/orgs/modifyOrgsSlice";
import { GET_ORG, EDIT_ORG } from "../../../store/actions/orgsActions";
import useToasts from "../../../hooks/useToasts";

import OrgForm from "../../../components/forms/Orgs/ContactDetailsForm";

function EditOrg(props) {
  const {
    loading,
    org,
    updating,
    isModified,
    getOrg,
    updateOrg,
    reset,
    error,
    updateError,
  } = props;
  console.log({ props });

  const toasts = useToasts();
  const navigate = useNavigate();
  const params = useParams();
  const { orgId } = params;

  useEffect(() => {
    getOrg(orgId);
  }, [getOrg, orgId]);

  useEffect(() => {
    if (isModified) {
      reset();
      toasts.success("Successfully updated the Organization!");
      navigate(-1);
    }
  }, [isModified, reset, navigate, toasts]);

  useEffect(() => {
    if (error || updateError) {
      toasts.error(error.message || updateError.message);
    }
  }, [error, updateError, toasts]);

  return (
    <SkeletonText isLoaded={!loading}>
      <OrgForm
        org={org}
        loading={updating}
        onFormSubmit={(data) => updateOrg({ ...data, id: orgId })}
      />
    </SkeletonText>
  );
}

function mapStateToProps(state) {
  const {
    loading: updating,
    isModified,
    error: updateError,
  } = state.modifyOrgsReducer;
  const { loading, org, error } = state.orgsReducer;

  return {
    loading,
    org,
    error,
    updating,
    isModified,
    updateError,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getOrg: (orgId) => dispatch({ type: GET_ORG, orgId }),
    updateOrg: (payload) => dispatch({ type: EDIT_ORG, data }),
    reset: () => dispatch(modifyOrgsReset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOrg);
