
/*import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { http } from "../api/http";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loadingMe, setLoadingMe] = useState(false);

  const fetchMe = async () => {
    setLoadingMe(true);
    try {
      const { data } = await http.get("/api/auth/me");
      setUser(data.data);
      return data.data;
    } finally {
      setLoadingMe(false);
    }
  };

 const login = async ({ correo, password }) => {
  const { data } = await http.post("/api/auth/login", { correo, password });
  localStorage.setItem("token", data.token);
  setToken(data.token);

  const me = await fetchMe();
   console.log("ME:", me);

  return me; // ✅ importante
};

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // ✅ clave: si ya hay token (refresh o navegación), cargar /me
  useEffect(() => {
    if (!token) return;
    if (user) return;

    fetchMe().catch(() => {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo(
    () => ({ token, user, loadingMe, login, logout, fetchMe }),
    [token, user, loadingMe]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
*/
//auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/auth.service";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
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
    localStorage.setItem("token", data.token);
    setToken(data.token);
    const me = await fetchMe();
    return me;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (!token) return;
    if (user) return;

    fetchMe().catch(() => {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo(
    () => ({ token, user, loadingMe, login, logout, fetchMe }),
    [token, user, loadingMe]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
