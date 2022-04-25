import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import PropTypes from "prop-types";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const userProfile = useSelector((state) => state.authReducer.userProfile);

  return userProfile ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
