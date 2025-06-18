import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PageLoader from "./PageLoader";
import PropTypes from "prop-types";

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  console.log("PrivateRoute user:", user);
  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    return <Outlet />;
  }

  const userRoles = user?.roles || [];
  const hasPermission = allowedRoles.some((role) =>
    userRoles.includes(role.toUpperCase())
  );

  if (hasPermission) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
};
PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
