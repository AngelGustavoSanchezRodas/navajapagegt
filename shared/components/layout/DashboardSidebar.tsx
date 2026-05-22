"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  Settings, 
  CreditCard,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { authService } from "@/modules/auth/services/auth.service";
import { cn } from "@/shared/lib/utils";
import { BrandLogo } from "./BrandLogo";
import { ProUpgradeModal } from "@/shared/components/ui/ProUpgradeModal";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isProModalOpen, setIsProModalOpen] = useState(false);

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

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200/60 sticky top-0 h-screen transition-all duration-300">
      <div className="p-8">
        <BrandLogo />
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
                      <span className="hidden md:block text-sm">{item.label}</span>
                    </div>
                    {isActive && <ChevronRight size={14} className="animate-in slide-in-from-left-1" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
        <button
          onClick={() => setIsProModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-200 to-yellow-400 px-4 py-3 text-sm font-black uppercase tracking-wider text-amber-900 transition-all hover:shadow-lg hover:shadow-yellow-500/20 active:scale-95 border border-yellow-300"
        >
          <Sparkles size={16} className="animate-pulse shrink-0" />
          <span className="hidden md:block">Upgrade PRO</span>
        </button>
      </div>

      <ProUpgradeModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
        message="Actualiza a PRO para acceder a todas las funciones avanzadas."
      />
    </aside>
  );
}
