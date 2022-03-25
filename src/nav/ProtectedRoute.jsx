import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import useAuth from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const location = useLocation;
  const navigate = useNavigate();
  const userProfile = useAuth();
  // console.log({ userProfile });

  useEffect(() => {
    if (!userProfile) {
      navigate("/login", { state: { from: location } });
    }
  }, [userProfile, navigate, location]);

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
