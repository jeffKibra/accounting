import { useEffect } from "react";
import { SkeletonText } from "@chakra-ui/react";
import { connect } from "react-redux";

import { GET_ORGS, EDIT_ORG } from "../../../store/actions/orgsActions";
import { modifyOrgsReset } from "../../../store/slices/orgs/modifyOrgsSlice";

import useToasts from "../../../hooks/useToasts";

import OrgsTable from "../../../components/tables/Orgs/OrgsTable";

function Orgs(props) {
  const {
    loading,
    orgs,
    getOrgs,
    deleting,
    isModified,
    error,
    deleteOrg,
    reset,
  } = props;
  console.log({ props });
  const toasts = useToasts();

  useEffect(() => {
    getOrgs();
  }, [getOrgs]);

  useEffect(() => {
    if (isModified) {
      toasts.success("Organization successfully deleted!");
      reset();
      getOrgs();
    }
  }, [isModified, reset, getOrgs, toasts]);

  useEffect(() => {
    if (error) {
      toasts.error(error.message);
    }
  }, [error, toasts]);

  return (
    <div>
      <SkeletonText isLoaded={!loading}>
        <OrgsTable
          deleteOrg={deleteOrg}
          deleting={deleting}
          isDeleted={isModified}
          orgs={orgs || []}
        />
      </SkeletonText>
    </div>
  );
}

function mapStateToProps(state) {
  const { loading, orgs } = state.orgsReducer;
  const { loading: deleting, isModified, error } = state.modifyOrgsReducer;
  console.log({ ll: state });
  return {
    loading,
    orgs,
    deleting,
    isModified,
    error,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getOrgs: () => dispatch({ type: GET_ORGS }),
    deleteOrg: (id) =>
      dispatch({ type: EDIT_ORG, data: { id, status: "deleted" } }),
    reset: () => dispatch(modifyOrgsReset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Orgs);
