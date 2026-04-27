"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  plan: 'FREE' | 'PRO';
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return !!Cookies.get("token");
    }
    return false;
  });
  
  // Dummy state for plan. In a real app this would come from a decoded JWT or /me endpoint.
  const [plan] = useState<'FREE' | 'PRO'>('FREE');

  const login = (token: string) => {
    Cookies.set("token", token, { expires: 7 }); // 7 días
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, plan, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
