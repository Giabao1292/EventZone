import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getToken, removeToken, setToken as saveToken } from "../utils/storage";
import { getUserDetail } from "../services/userServices";
import PageLoader from "../ui/PageLoader";
import { getOrganizerByUserId } from "../services/organizerService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Hàm tải thông tin người dùng
  const loadUser = async () => {
    if (!token) {
      finishLoading();
      return;
    }

    try {
      const userData = await getUserDetail();
      const storedRoles = localStorage.getItem("userRoles");
      const roles = storedRoles ? JSON.parse(storedRoles) : [];

      let organizerData = null;
      if (roles.includes("ORGANIZER")) {
        organizerData = await getOrganizerByUserId(userData.id);
      }

      const finalUserData = {
        ...userData,
        roles,
        organizer: organizerData || null,
      };

      setUser(finalUserData);
      setIsAuthenticated(true);
    } catch (error) {
      // ...
    } finally {
      finishLoading();
    }
  };
  const finishLoading = () => {
    setLoading(false);
  };

  // Đăng nhập
  const login = (data) => {
    const { accessToken, ...userData } = data;

    saveToken(accessToken);
    setToken(accessToken);

    const roles = userData.roles || [];
    localStorage.setItem("userRoles", JSON.stringify(roles));

    setUser(userData);
    setIsAuthenticated(true);
  };

  // Cập nhật thông tin người dùng
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Đăng xuất
  const logout = () => {
    localStorage.clear();
    removeToken();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    loadUser();
  }, [token]);

  const authValue = {
    token,
    user,
    isAuthenticated,
    loading,
    login,
    updateUser,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {loading ? <PageLoader /> : children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
