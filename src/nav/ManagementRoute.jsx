import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";

import * as routes from "./routes";

import useAuth from "../hooks/useAuth";

import ProtectedRoute from "./ProtectedRoute";

function MRoute({ children }) {
  const userProfile = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSamePage, setIsSamePage] = useState(false);

  useEffect(() => {
    if (userProfile?.orgs?.length > 0) {
      setIsSamePage(true);
    } else {
      if (location.pathname === routes.NEW_ORG) {
        setIsSamePage(true);
      } else {
        navigate(routes.NEW_ORG);
      }
    }
  }, [navigate, userProfile, location]);
  console.log("management route");

  return isSamePage ? children : <p>access denied</p>;
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
