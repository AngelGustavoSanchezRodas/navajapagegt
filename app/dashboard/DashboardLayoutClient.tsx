"use client";

import React from "react";
import { DashboardSidebar } from "@/shared/components/layout/DashboardSidebar";
import { DashboardTopbar } from "@/shared/components/layout/DashboardTopbar";
import { DashboardProvider, useDashboard } from "@/shared/contexts/DashboardContext";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useDashboard();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>

      {/* Main App Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar inside the shell */}
        <DashboardTopbar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-2xl active:scale-95 transition-transform"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-white animate-in fade-in slide-in-from-bottom-4 duration-300">
            <DashboardSidebar />
          </div>
        )}

        {/* Page Content */}
        <main key={pathname} className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 md:py-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </DashboardProvider>
  );
}
