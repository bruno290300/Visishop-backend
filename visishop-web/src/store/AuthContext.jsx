import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const USERS_STORAGE_KEY = "visishop.auth.users.v1";
const SESSION_STORAGE_KEY = "visishop.auth.session.v1";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeUserName(name) {
  return String(name || "").trim().toLowerCase();
}

function readUsers() {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function readSession() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.id && parsed.name ? parsed : null;
  } catch {
    return null;
  }
}

function writeSession(user) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(readSession);

  async function register(payload) {
    const name = String(payload?.name || "").trim();
    const password = String(payload?.password || "").trim();

    await wait(700);

    if (!name || !password) {
      throw new Error("Completa usuario y contraseña.");
    }

    const users = readUsers();
    const normalized = normalizeUserName(name);
    const alreadyExists = users.some(
      (user) => normalizeUserName(user.name) === normalized
    );

    if (alreadyExists) {
      throw new Error("Ese usuario ya existe. Inicia sesión.");
    }

    const nextUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
      name,
      password,
    };

    const nextUsers = [...users, nextUser];
    writeUsers(nextUsers);
    writeSession({ id: nextUser.id, name: nextUser.name });
    setCurrentUser({ id: nextUser.id, name: nextUser.name });

    return { id: nextUser.id, name: nextUser.name };
  }

  async function login(payload) {
    const name = String(payload?.name || "").trim();
    const password = String(payload?.password || "").trim();

    await wait(500);

    const users = readUsers();
    const normalized = normalizeUserName(name);
    const foundUser = users.find(
      (user) => normalizeUserName(user.name) === normalized
    );

    if (!foundUser || foundUser.password !== password) {
      throw new Error("Usuario o contraseña incorrectos.");
    }

    const sessionUser = { id: foundUser.id, name: foundUser.name };
    writeSession(sessionUser);
    setCurrentUser(sessionUser);

    return sessionUser;
  }

  function logout() {
    clearSession();
    setCurrentUser(null);
  }

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      register,
      login,
      logout,
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }
  return context;
}
