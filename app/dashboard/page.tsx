"use client";

import React, { useState, useEffect } from 'react';
import { UrlShortenerTool } from '@/features/links/components/UrlShortenerTool';
import BiolinkBuilder from '@/features/dashboard/components/BiolinkBuilder';
import { WifiQrGenerator } from '@/features/tools/components/WifiQrGenerator';
import { GlassCard } from '@/shared/components/ui/GlassCard';
import { useDashboard } from '@/shared/contexts/DashboardContext';
import { 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Wifi, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const { activeTab, setActiveTab } = useDashboard();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(new Date().toLocaleDateString('es-ES', options));
  }, []);

  const tools = [
    { 
      id: 'shortener', 
      category: 'shortener',
      name: 'Acortador de Enlaces', 
      description: 'Crea enlaces cortos y mide su impacto con analíticas avanzadas.',
      icon: LinkIcon, 
      component: <UrlShortenerTool /> 
    },
    { 
      id: 'biolink', 
      category: 'biolink',
      name: 'Constructor Biolink', 
      description: 'Tu página personal optimizada para redes sociales con múltiples enlaces.',
      icon: ImageIcon, 
      component: <BiolinkBuilder /> 
    },
    { 
      id: 'wifi', 
      category: 'qr',
      name: 'Generador QR Wi-Fi', 
      description: 'Comparte tu conexión de forma segura sin revelar contraseñas.',
      icon: Wifi, 
      component: <WifiQrGenerator /> 
    },
  ];

  const filteredTools = activeTab === 'all' || activeTab === 'top'
    ? tools 
    : tools.filter(t => t.category === activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case 'shortener':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <UrlShortenerTool />
          </div>
        );
      case 'biolink':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BiolinkBuilder />
          </div>
        );
      case 'qr':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <WifiQrGenerator />
          </div>
        );
      case 'top':
      case 'all':
      default:
        return (
          <div className="flex flex-col gap-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-brand-turquoise font-bold text-sm uppercase tracking-widest">
                  <Sparkles size={16} />
                  {activeTab === 'top' ? 'Lo más utilizado' : 'Todas las herramientas'}
                </div>
                <h1 className="text-4xl md:text-5xl font-[950] text-slate-900 tracking-tight">
                  Bienvenido de nuevo
                </h1>
                <p className="text-slate-500 font-medium capitalize first-letter:uppercase">
                  {currentDate}
                </p>
              </div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className="group text-left w-full transition-all duration-300 hover:-translate-y-2"
                >
                  <GlassCard className="p-8 h-full flex flex-col items-start gap-5 cursor-pointer rounded-[2rem] border-2 border-transparent group-hover:border-brand-turquoise/30 group-hover:shadow-[0_32px_64px_-16px_rgba(0,229,255,0.15)] transition-all">
                    <div className="p-4 bg-slate-50 rounded-2xl text-slate-600 transition-colors group-hover:bg-brand-turquoise/10 group-hover:text-brand-turquoise">
                      <tool.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xl mb-2">{tool.name}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{tool.description}</p>
                    </div>
                    <div className="mt-auto pt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-turquoise opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                      Abrir Herramienta <ArrowRight size={14} />
                    </div>
                  </GlassCard>
                </button>
              ))}
            </section>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto py-12 px-6 lg:px-8 min-h-screen">
      {renderContent()}
    </div>
  );
}