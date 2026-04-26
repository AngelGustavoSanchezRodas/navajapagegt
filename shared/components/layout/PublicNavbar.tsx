"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { User, LayoutDashboard, Settings, LogOut, ChevronDown } from "lucide-react";
import { authService } from "@/modules/auth/services/auth.service";
import { siteConfig } from "@/shared/config/site";
import { cn } from "@/shared/lib/utils";

export function PublicNavbar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = Cookies.get("token");
    setIsAuthenticated(!!token);
  }, []);

  // Cerrar dropdown al cambiar de ruta
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/";
  };

  const dropdownItems = [
    { label: "Mi Workspace", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Configuración", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/40 bg-white/70 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-xl font-bold text-brand-turquoise transition-transform hover:scale-105"
        >
          <span className="bg-gradient-to-r from-brand-turquoise to-emerald-500 bg-clip-text text-transparent">
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {!isMounted ? (
            <div className="h-10 w-32 animate-pulse rounded-full bg-slate-100" />
          ) : (
            <AnimatePresence mode="wait">
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    key="auth-trigger"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={cn(
                      "group flex items-center gap-2 rounded-full border p-1 pr-3 transition-all active:scale-95",
                      isDropdownOpen 
                        ? "border-brand-turquoise bg-brand-turquoise/5 ring-4 ring-brand-turquoise/10" 
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors group-hover:bg-brand-turquoise/10 group-hover:text-brand-turquoise">
                      <User size={18} />
                    </div>
                    <ChevronDown size={14} className={cn("text-slate-400 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                  </motion.button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black/5"
                      >
                        <div className="px-3 py-2 mb-2 border-b border-slate-50">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cuenta</p>
                        </div>
                        
                        {dropdownItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-brand-turquoise"
                          >
                            <item.icon size={18} />
                            {item.label}
                          </Link>
                        ))}
                        
                        <div className="my-2 border-t border-slate-100" />
                        
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-500 transition-all hover:bg-red-50"
                        >
                          <LogOut size={18} />
                          Cerrar Sesión
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.nav
                  key="guest"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3"
                  aria-label="Navegación principal"
                >
                  <Link
                    href="/login"
                    className="rounded-full px-5 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-xl active:scale-95"
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
