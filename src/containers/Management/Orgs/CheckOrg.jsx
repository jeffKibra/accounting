import { connect } from 'react-redux';
// import { useLocation } from 'react-router-dom';
//
//
import { useGetOrg } from 'hooks';
//
// import NewOrgPage from 'pages/Management/Orgs/NewOrgPage';
//
import FullPageSpinner from '../../../components/ui/FullPageSpinner';

// function checkIfIsAuthRoute(pathname) {
//   const isAuthRoute = String(pathname).split('/')[0] === 'auth';

//   console.log({ pathname, isAuthRoute });

//   return isAuthRoute;
// }

function CheckOrg(props) {
  const { children } = props;

  // const { pathname } = useLocation();
  // console.log({ pathname });

  // const isAuthRoute = checkIfIsAuthRoute(pathname);

  const { loading } = useGetOrg();

  return loading ? (
    <FullPageSpinner label="Loading Org Details..." />
  ) : (
    children
  );
}

function mapStateToProps(state) {
  const { org } = state.orgsReducer;
  const { userProfile } = state.authReducer;

  return { org, userProfile };
}

export default connect(mapStateToProps)(CheckOrg);
