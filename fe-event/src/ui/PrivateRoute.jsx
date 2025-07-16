import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../features/authentication/hooks/useAuth";

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Đang tải...</div>; // Hiển thị loading khi đang kiểm tra token
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
