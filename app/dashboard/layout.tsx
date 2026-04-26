"use client";

import React from "react";
import { DashboardSidebar } from "@/shared/components/layout/DashboardSidebar";
import { DashboardTopbar } from "@/shared/components/layout/DashboardTopbar";
import { DashboardProvider, useDashboard } from "@/shared/contexts/DashboardContext";
import { Menu, X } from "lucide-react";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useDashboard();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Sidebar Desktop */}
      <DashboardSidebar />

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
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
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
