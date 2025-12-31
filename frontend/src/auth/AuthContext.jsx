import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/auth.service";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loadingMe, setLoadingMe] = useState(false);

  const fetchMe = async () => {
    setLoadingMe(true);
    try {
      const { data } = await authService.me();
      setUser(data.data);
      return data.data;
    } finally {
      setLoadingMe(false);
    }
  };

  const login = async ({ correo, password }) => {
    const { data } = await authService.login({ correo, password });
    sessionStorage.setItem("token", data.token);
    setToken(data.token);
    const me = await fetchMe();
    return me;
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!token) return;
    if (user) return;

    fetchMe().catch(() => {
      sessionStorage.removeItem("token");
      setToken(null);
      setUser(null);
    });
  }, [token, user]);

  const value = useMemo(
    () => ({ token, user, loadingMe, login, logout, fetchMe }),
    [token, user, loadingMe]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

// ✅ ESTE EXPORT ES EL QUE TE FALTA O NO ESTÁ SALIENDO
export const useAuth = () => useContext(AuthCtx);
