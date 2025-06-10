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
          // Gọi API /me để lấy thông tin người dùng
          const userData = await getUserDetail();
          // Lấy roles từ localStorage nếu có
          const storedRoles = localStorage.getItem("userRoles");
          let finalRoles = [];

          if (storedRoles && storedRoles !== "undefined") {
            finalRoles = JSON.parse(storedRoles);
          }

          const finalUserData = {
            ...userData,
            roles: finalRoles,
          };

          setUser(finalUserData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Lỗi khi tải thông tin người dùng:", error.message);
          logout();
        }
      }

      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = (data) => {
    setToken(data.accessToken);
    console.log("Login asd:", data.roles);
    localStorage.setItem("userRoles", JSON.stringify(data.roles));
    setUser({
      ...data,
      roles: data.roles || [],
    });
    setIsAuthenticated(true);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.clear();
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
