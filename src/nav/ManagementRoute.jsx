import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import useSavedLocation from "../hooks/useSavedLocation";

import * as routes from "./routes";

import ProtectedRoute from "./ProtectedRoute";

function MRoute({ children }) {
  const location = useLocation();
  const org = useSelector((state) => state.orgsReducer.org);
  const savedLocation = useSavedLocation().getLocation() || "/";

  const isNewOrgRoute = location.pathname === routes.NEW_ORG;

  return org && isNewOrgRoute ? (
    <Navigate to={savedLocation} />
  ) : org || isNewOrgRoute ? (
    children
  ) : (
    <Navigate to={routes.NEW_ORG} />
  );
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
