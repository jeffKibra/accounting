import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

import useSavedLocation from "../hooks/useSavedLocation";

function PublicRoute({ children }) {
  const userProfile = useSelector((state) => state.authReducer.userProfile);
  const prevLocation = useSavedLocation().getLocation() || "/";

  return userProfile ? <Navigate to={prevLocation} replace /> : children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
