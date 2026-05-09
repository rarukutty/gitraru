// ============================================================
// Auth Context — Provides user session state to the entire app
// ============================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getSession, logout as logoutStorage, UserSession } from "@/lib/storage";

interface AuthContextType {
  user: UserSession | null;
  refreshSession: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  refreshSession: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(getSession());

  const refreshSession = () => setUser(getSession());

  const logout = () => {
    logoutStorage();
    setUser(null);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, refreshSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
