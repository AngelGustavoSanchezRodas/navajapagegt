"use client";

import React from "react";
import { 
  Bell, 
  User, 
  Sparkles, 
  LayoutGrid, 
  Link as LinkIcon, 
  ImageIcon, 
  QrCode,
  Search,
  ChevronDown,
  LogOut
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DashboardTopbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DashboardTopbar({ activeTab, onTabChange }: DashboardTopbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };
  const tabs = [
    { id: "shortener", label: "Acortador", icon: LinkIcon, color: "text-brand-turquoise", bg: "bg-brand-turquoise/10" },
    { id: "qr", label: "Códigos QR", icon: QrCode, color: "text-amber-600", bg: "bg-amber-500/10" },
    { id: "signature", label: "Firmas", icon: ImageIcon, color: "text-brand-magenta", bg: "bg-brand-magenta/10" },
    { id: "image-converter", label: "Convertidor", icon: ImageIcon, color: "text-slate-900", bg: "bg-slate-900/10" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/40 bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8 gap-8">
        {/* Navigation Wrapper */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Mega Menú: Todas las Herramientas */}
          <div className="group relative">
            <button
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300",
                activeTab === "all"
                  ? "bg-slate-900 text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <LayoutGrid size={16} />
              Todas las herramientas
              <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
            </button>

            {/* Dropdown Mega Menú */}
            <div className="absolute left-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300">
              <div className="w-[480px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl ring-1 ring-black/5">
                <div className="mb-4 px-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nuestro Ecosistema</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {tabs.map((tool) => (
                    <Link
                      key={tool.id}
                      href="/dashboard"
                      onClick={() => onTabChange(tool.id)}
                      className="group/item flex items-start gap-4 rounded-xl p-4 text-left transition-all hover:bg-slate-50"
                    >
                      <div className={cn("mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover/item:scale-110", tool.bg, tool.color)}>
                        <tool.icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{tool.label}</h4>
                        <p className="text-[11px] font-medium leading-relaxed text-slate-400">Acceso directo a la herramienta</p>
                      </div>
                    </Link>
                  ))}
                  
                  {/* Option for the Top tab in the menu too? Or just a special footer? */}
                  <div className="col-span-2 mt-2 border-t border-slate-50 pt-2">
                    <Link 
                      href="/dashboard"
                      onClick={() => onTabChange("all")}
                      className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold text-slate-400 hover:bg-slate-50 hover:text-brand-turquoise transition-colors"
                    >
                      Ver vista general de herramientas
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="mx-2 h-6 w-px bg-slate-200" />

          {/* Individual Tabs */}
          <nav className="flex flex-nowrap overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide no-scrollbar gap-2 md:gap-4 px-2 min-w-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              // Lógica de color dinámico basándose en la herramienta
              const activeClasses = tab.color && tab.bg 
                ? `${tab.bg} ${tab.color}` 
                : "bg-brand-turquoise/10 text-brand-turquoise";

              return (
                <Link
                  key={tab.id}
                  href="/dashboard"
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 active:scale-95 shrink-0",
                    isActive
                      ? activeClasses
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <tab.icon size={16} className={cn("transition-transform duration-300", isActive && "scale-110")} />
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* <button className="relative p-2.5 text-slate-500 transition-all hover:bg-slate-100 rounded-full hover:text-slate-900 active:scale-90">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 flex h-2 w-2 rounded-full bg-brand-magenta ring-2 ring-white" />
          </button>
          
          <div className="h-8 w-px bg-slate-200 mx-1" /> */}
          
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1 pr-3 rounded-full border border-slate-200 hover:border-slate-300 transition-all active:scale-95 bg-white shadow-sm"
            >
               <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-100 flex items-center justify-center text-slate-600 overflow-hidden">
                  <User size={18} />
               </div>
               <div className="flex flex-col items-start hidden lg:flex mr-1 text-left">
                 <span className="text-xs font-black text-slate-700 leading-tight">{user?.nombre || 'Perfil'}</span>
                 <span className="text-[9px] font-bold text-slate-400 truncate max-w-[100px]">{user?.email || ''}</span>
               </div>
               <ChevronDown size={14} className="text-slate-400 hidden lg:block" />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-2">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
