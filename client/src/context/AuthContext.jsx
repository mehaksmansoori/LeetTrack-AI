import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "leettrack-token";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setReady(true);
        return;
      }

      try {
        const response = await apiRequest("/auth/me", { token });
        setUser(response.user);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setUser(null);
      } finally {
        setReady(true);
      }
    };

    bootstrap();
  }, [token]);

  const persistAuth = (payload) => {
    localStorage.setItem(TOKEN_KEY, payload.token);
    setToken(payload.token);
    setUser(payload.user);
  };

  const login = async (credentials) => {
    const payload = await apiRequest("/auth/login", {
      method: "POST",
      body: credentials
    });
    persistAuth(payload);
  };

  const signup = async (credentials) => {
    const payload = await apiRequest("/auth/signup", {
      method: "POST",
      body: credentials
    });
    persistAuth(payload);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setUser(null);
  };

  const value = {
    token,
    user,
    ready,
    login,
    signup,
    logout,
    setUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
};
