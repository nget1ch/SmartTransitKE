import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getApiErrorMessage } from "../services/api.js";

const AuthContext = createContext(null);

const STORAGE_USER = "stke_user";
const STORAGE_TOKEN = "stke_token";

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => safeJsonParse(localStorage.getItem(STORAGE_USER)));
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN) || "");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (token) localStorage.setItem(STORAGE_TOKEN, token);
    else localStorage.removeItem(STORAGE_TOKEN);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_USER);
  }, [user]);

  const isAuthenticated = Boolean(token && user?.id);

  async function login({ email, password }) {
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      setToken(res.data.accessToken || res.data.token);
      setUser(res.data.user);
      return { ok: true };
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setAuthError(msg);
      return { ok: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
  }

  async function register({ name, email, password }) {
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await api.post("/auth/register", { name, email, password, role: "CUSTOMER" });
      // backend returns {token, user}
      setToken(res.data.accessToken || res.data.token);
      setUser(res.data.user);
      return { ok: true };
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setAuthError(msg);
      return { ok: false, message: msg };
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken("");
    setAuthError("");
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      authLoading,
      authError,
      login,
      register,
      logout,
    }),
    [user, token, isAuthenticated, authLoading, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

