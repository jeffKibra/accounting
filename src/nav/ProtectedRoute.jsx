import { useSelector } from 'react-redux';
// import { useLocation, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import LoginPage from 'pages/Auth/LoginPage';

function ProtectedRoute({ children }) {
  const userProfile = useSelector(state => state.authReducer.userProfile);

  return userProfile ? children : <LoginPage />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
