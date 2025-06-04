import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getToken, removeToken } from "../utils/storage";
import { getUserDetail } from "../services/userServices";
import PageLoader from "../ui/PageLoader";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const userData = await getUserDetail();
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            console.error("Không nhận được dữ liệu người dùng hợp lệ");
            logout();
          }
        } catch (error) {
          console.error("Lỗi khi tải thông tin người dùng:", error.message);
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = (data) => {
    setToken(data.accessToken);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const logout = () => {
    removeToken();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        loading,
        login,
        updateUser,
        logout,
      }}
    >
      {loading ? <PageLoader /> : children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
