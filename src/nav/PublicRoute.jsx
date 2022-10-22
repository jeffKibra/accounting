import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function PublicRoute({ children }) {
  const userProfile = useSelector(state => state.authReducer.userProfile);

  return userProfile ? <Navigate to="/" replace /> : children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
