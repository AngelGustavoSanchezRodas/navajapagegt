"use client";

import React, { createContext, useContext, useState } from "react";

interface DashboardContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeTool: string | null;
  setActiveTool: (tool: string | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState("all");
  const [activeTool, setActiveTool] = useState<string | null>(null);

  return (
    <DashboardContext.Provider 
      value={{ 
        activeTab, 
        setActiveTab, 
        activeTool, 
        setActiveTool 
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
