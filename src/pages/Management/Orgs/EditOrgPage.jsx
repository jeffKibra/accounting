import { useEffect } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { reset } from "../../../store/slices/orgsSlice";
import { GET_ORG, UPDATE_ORG } from "../../../store/actions/orgsActions";

import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import Empty from "../../../components/ui/Empty";

import PageLayout from "../../../components/layout/PageLayout";
import EditOrg from "../../../containers/Admin/Orgs/EditOrg";

function EditOrgPage(props) {
  const { loading, org, isModified, action, getOrg, updateOrg, resetOrg } =
    props;
  console.log({ props });

  const navigate = useNavigate();
  const params = useParams();
  const { orgId } = params;

  useEffect(() => {
    getOrg(orgId);
  }, [getOrg, orgId]);

  useEffect(() => {
    if (isModified) {
      resetOrg();
      navigate(-1);
    }
  }, [isModified, resetOrg, navigate]);

  return (
    <PageLayout pageTitle="Edit Organization">
      {loading && action === GET_ORG ? (
        <SkeletonLoader />
      ) : org ? (
        <EditOrg
          org={org}
          loading={loading && action === UPDATE_ORG}
          saveData={(data) => updateOrg({ ...data, id: orgId })}
        />
      ) : (
        <Empty />
      )}
    </PageLayout>
  );
}

function mapStateToProps(state) {
  const { loading, org, isModified, action } = state.orgsReducer;

  return {
    loading,
    org,
    isModified,
    action,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getOrg: (orgId) => dispatch({ type: GET_ORG, orgId }),
    updateOrg: (data) => dispatch({ type: UPDATE_ORG, data }),
    resetOrg: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditOrgPage);
