import React, { createContext, useEffect, useState } from "react";
import * as authService from "../services/auth.service";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const res = await authService.me();
          setUser(res.data?.user || null);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (creds) => {
    const res = await authService.login(creds);
    const payload = res.data || {};
    if (payload.token) localStorage.setItem("token", payload.token);
    setUser(payload.user || null);
    return payload;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    const payload = res.data || {};
    if (payload.token) localStorage.setItem("token", payload.token);
    setUser(payload.user || null);
    return payload;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn("logout error", err?.message || err);
    }
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
