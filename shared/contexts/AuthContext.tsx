"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Cookies from "js-cookie";
import { UserProfile } from "@/modules/auth/services/auth.service";

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  hasPremiumAccess: boolean;
  plan: 'FREE' | 'PRO';
  login: (token: string, user?: UserProfile) => void;
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

  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  const hasPremiumAccess = (() => {
    if (!user) return false;
    if (user.rol === 'ADMIN') return true;
    
    const isPremium = user.plan === 'PREMIUM';
    const expiration = user.premium_hasta || user.premiumHasta;
    const isNotExpired = expiration ? new Date(expiration) > new Date() : false;
    
    return isPremium && isNotExpired;
  })();

  const login = (token: string, userData?: UserProfile) => {
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

  const fetchUserSession = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const userData = data.user || data;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        // Token is invalid or expired
        logout();
      }
    } catch (error) {
      console.error("Error fetching user session:", error);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (Cookies.get("token")) {
      fetchUserSession();
    }

    const handleSessionExpired = () => {
      logout();
    };

    window.addEventListener("auth-session-expired", handleSessionExpired);
    return () => {
      window.removeEventListener("auth-session-expired", handleSessionExpired);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      hasPremiumAccess, 
      plan: hasPremiumAccess ? 'PRO' : 'FREE',
      login, 
      logout 
    }}>
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