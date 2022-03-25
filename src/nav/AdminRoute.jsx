import PropTypes from "prop-types";

import { isAdmin } from "../utils/roles";

import useAuth from "../hooks/useAuth";

import ProtectedRoute from "./ProtectedRoute";

function ARoute({ children }) {
  const userProfile = useAuth();
  // console.log({ userProfile });

  return isAdmin(userProfile?.role) ? children : <p>access denied</p>;
}

export default function AdminRoute({ children }) {
  return (
    <ProtectedRoute>
      <ARoute>{children}</ARoute>
    </ProtectedRoute>
  );
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
