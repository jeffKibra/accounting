import { connect } from 'react-redux';
//
//
import { useGetOrg } from 'hooks';
//
import NewOrgPage from 'pages/Management/Orgs/NewOrgPage';
//
import FullPageSpinner from '../../../components/ui/FullPageSpinner';

function CheckOrg(props) {
  const { children } = props;

  const { loading, data } = useGetOrg();

  return loading ? (
    <FullPageSpinner label="Loading Details..." />
  ) : data ? (
    children
  ) : (
    <NewOrgPage />
  );
}

function mapStateToProps(state) {
  const { loading, org, action } = state.orgsReducer;
  const { userProfile } = state.authReducer;

  return { loading, org, action, userProfile };
}

export default connect(mapStateToProps)(CheckOrg);
