"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { nombre: string; email: string; role?: string } | null;
  plan: 'FREE' | 'PRO';
  login: (token: string, user?: { nombre: string; email: string; role?: string }) => void;
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

  const [user, setUser] = useState<{ nombre: string; email: string; role?: string } | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  
  // Dummy state for plan. In a real app this would come from a decoded JWT or /me endpoint.
  const [plan] = useState<'FREE' | 'PRO'>('FREE');

  const login = (token: string, userData?: { nombre: string; email: string; role?: string }) => {
    Cookies.set("token", token, { expires: 7 }); // 7 días
    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleSessionExpired = () => {
      logout();
    };

    window.addEventListener("auth-session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth-session-expired", handleSessionExpired);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, plan, login, logout }}>
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
