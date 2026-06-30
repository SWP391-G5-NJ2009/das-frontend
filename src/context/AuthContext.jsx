import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service";

const AuthContext = createContext(null);

export const ROLE_HOME = {
  patient: "/patient/booking",
  receptionist: "/receptionist/consultation-request",
  dentist: "/dentist/schedule",
  owner: "/owner/services-management",
  admin: "/admin/accounts",
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const persistSession = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const loginPatient = async ({ phone, password }) => {
    const data = await authService.patientLogin({ phone, password });
    return persistSession(data);
  };

  const loginStaff = async ({ username, password }) => {
    const data = await authService.staffLogin({ username, password });
    return persistSession(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = {
    isLoading,
    loginPatient,
    loginStaff,
    logout,
    token,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  return useContext(AuthContext);
}
