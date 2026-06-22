import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { ROLE_HOME, useAuth } from "../context/AuthContext";
import Spinner from "../components/common/Spinner/Spinner";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isLoading } = useAuth();
  const loginPath =
    allowedRoles?.length && !allowedRoles.includes("patient")
      ? "/staff/login"
      : "/login";

  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to={loginPath} replace />;

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] || "/login"} replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

ProtectedRoute.defaultProps = {
  allowedRoles: null,
};

export default ProtectedRoute;
