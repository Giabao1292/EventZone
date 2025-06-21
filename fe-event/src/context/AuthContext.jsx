import { createContext, useEffect, useState, useCallback, useRef } from "react";
import { getToken, saveToken, removeToken } from "../utils/storage";
import { getUserDetail } from "../services/userServices";
import { getOrganizerByUserId } from "../services/organizerService";
import PropTypes from "prop-types";
import PageLoader from "../ui/PageLoader";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const isUserLoaded = useRef(false); // Track if user has been loaded

  // Memoized loadUser to prevent re-creation
  const loadUser = useCallback(async () => {
    // Skip if already loaded or no token
    if (isUserLoaded.current || !token) {
      setLoading(false);
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
      isUserLoaded.current = true; // Mark as loaded
    } catch (error) {
      console.error("Failed to load user:", error);
      setUser(null);
      setIsAuthenticated(false);
      // Optionally clear token if unauthorized
      if (error.response?.status === 401) {
        removeToken();
        setToken(null);
        localStorage.removeItem("userRoles");
      }
    } finally {
      setLoading(false);
    }
  }, [token]); // Depend on token

  // Login function
  const login = (data) => {
    const { accessToken, ...userData } = data;

    saveToken(accessToken);
    setToken(accessToken);

    const roles = userData.roles || [];
    localStorage.setItem("userRoles", JSON.stringify(roles));

    setUser(userData);
    setIsAuthenticated(true);
    isUserLoaded.current = true; // Mark as loaded to skip loadUser
  };

  // Update user
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // Logout
  const logout = () => {
    localStorage.clear();
    removeToken();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    isUserLoaded.current = false; // Reset for next login
  };

  // Run loadUser on mount or token change
  useEffect(() => {
    loadUser();
  }, [loadUser]); // Depend on loadUser to avoid re-running on token reference change

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
