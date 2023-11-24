import { connect } from 'react-redux';

import { isAdmin } from '../../../utils/roles';

import { reset } from '../../../store/slices/orgsSlice';
import { CREATE_ORG } from '../../../store/actions/orgsActions';

import { useAuth, useCreateOrg } from 'hooks';

import EditOrg from '../../../containers/Management/Orgs/EditOrg';

function NewOrgPage(props) {
  const userProfile = useAuth();

  const { createOrg, loading } = useCreateOrg();

  return (
    <EditOrg
      isAdmin={isAdmin(userProfile?.role)}
      loading={loading}
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
    createOrg: payload => dispatch({ type: CREATE_ORG, payload }),
    resetOrg: () => dispatch(reset()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewOrgPage);
