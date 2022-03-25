import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import useAuth from "../hooks/useAuth";

function PublicRoute({ children }) {
  const navigate = useNavigate();
  const userProfile = useAuth();

  useEffect(() => {
    if (userProfile) {
      navigate("/", { replace: true });
    }
  }, [userProfile, navigate]);

  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PublicRoute;
