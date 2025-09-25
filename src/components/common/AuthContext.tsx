// AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { getRole, getToken, setRole, setToken } from "../utils/tokens"; // Import setRole/setToken as well

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: getToken(),
    role: getRole(),
  });

  // Use a useEffect hook to update local storage whenever the state changes
  useEffect(() => {
    if (auth.token) {
      setToken(auth.token);
    } else {
      localStorage.removeItem("token");
    }

    if (auth.role) {
      setRole(auth.role);
    } else {
      localStorage.removeItem("role");
    }
  }, [auth.token, auth.role]);

  const updateAuth = (newToken, newRole) => {
    setAuth({
      token: newToken,
      role: newRole,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, updateAuth }}>
      {children}
    </AuthContext.Provider>
  );
};