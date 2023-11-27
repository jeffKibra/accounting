import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import NewOrgPage from 'pages/Management/Orgs/NewOrgPage';

import ProtectedRoute from './ProtectedRoute';

function MRoute({ children }) {
  const org = useSelector(state => state.orgsReducer.org);
  // console.log('MROUTE org:', org);

  return org ? children : <NewOrgPage />;
}

export default function ManagementRoute({ children }) {
  return (
    <ProtectedRoute>
      <MRoute>{children}</MRoute>
    </ProtectedRoute>
  );
}

ManagementRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
