import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [booting, setBooting] = useState(Boolean(localStorage.getItem("token")));

  useEffect(() => {
    if (!token) {
      setBooting(false);
      return;
    }

    let active = true;
    api
      .get("/auth/me")
      .then(({ data }) => {
        if (!active) return;
        const nextUser = {
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        };
        localStorage.setItem("user", JSON.stringify(nextUser));
        setUser(nextUser);
      })
      .catch(() => {
        if (!active) return;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        if (active) setBooting(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const login = (nextToken, nextUser) => {
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (partial) => {
    setUser((current) => {
      const next = { ...current, ...partial };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(
    () => ({
      user,
      token,
      booting,
      isAuthenticated: Boolean(user && token),
      login,
      logout,
      updateUser,
    }),
    [user, token, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
