"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/modules/auth/services/auth.service";
import { siteConfig } from "@/shared/config/site";

export function PublicNavbar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-brand-turquoise">
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-3">
          {!isMounted ? (
            <div className="h-10 w-32 animate-pulse rounded-full bg-slate-200" />
          ) : (
            <AnimatePresence mode="wait">
              {isAuthenticated ? (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3"
                >
                  <Link
                    href="/dashboard"
                    className="rounded-full bg-brand-turquoise px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 shadow-lg shadow-brand-turquoise/20"
                  >
                    Ir al Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      authService.logout();
                      window.location.href = "/";
                    }}
                    className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    Cerrar Sesión
                  </button>
                </motion.div>
              ) : (
                <motion.nav
                  key="guest"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-3"
                  aria-label="Navegación principal"
                >
                  <Link
                    href="/login"
                    className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-brand-turquoise px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 shadow-lg shadow-brand-turquoise/20"
                  >
                    Registrarse
                  </Link>
                </motion.nav>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </header>
  );
}
