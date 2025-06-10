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

  // Nếu chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu không có yêu cầu về role (cho phép tất cả người dùng đã đăng nhập)
  if (!allowedRoles || allowedRoles.length === 0) {
    return <Outlet />;
  }

  // Kiểm tra xem người dùng có vai trò phù hợp không
  const userRoles = user?.roles || [];
  const hasPermission = allowedRoles.some((role) =>
    userRoles.includes(role.toUpperCase())
  );

  if (hasPermission) {
    return <Outlet />;
  }

  // Nếu không có quyền, chuyển hướng đến trang lỗi hoặc trang chủ
  return <Navigate to="/" replace />;
};
PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;
