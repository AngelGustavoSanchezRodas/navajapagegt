"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  Settings, 
  CreditCard, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { authService } from "@/modules/auth/services/auth.service";
import { cn } from "@/shared/lib/utils";

export function DashboardSidebar() {
  const pathname = usePathname();

  const sections = [
    {
      title: "Workspace",
      items: [
        { label: "Herramientas", icon: LayoutDashboard, href: "/dashboard" },
        { label: "Mis Enlaces", icon: LinkIcon, href: "/dashboard/links" },
      ],
    },
    {
      title: "Cuenta",
      items: [
        { label: "Configuración", icon: Settings, href: "/dashboard/settings" },
        { label: "Facturación", icon: CreditCard, href: "/dashboard/billing" },
      ],
    },
  ];

  const handleLogout = () => {
    authService.logout();
    window.location.href = "/";
  };

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200/60 sticky top-0 h-screen transition-all duration-300">
      <div className="p-8">
        <Link href="/" className="group flex items-center gap-2 text-2xl font-black text-brand-turquoise tracking-tighter">
          Navaja<span className="text-slate-900 transition-colors group-hover:text-brand-turquoise">GT</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-8">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all duration-200",
                      isActive
                        ? "bg-brand-turquoise/10 text-brand-turquoise shadow-sm shadow-brand-turquoise/5"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className={cn("transition-transform group-hover:scale-110", isActive ? "text-brand-turquoise" : "text-slate-400")} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight size={14} className="animate-in slide-in-from-left-1" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut size={18} />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
