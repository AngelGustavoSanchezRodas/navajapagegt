"use client";

import React, { useState, useEffect } from 'react';
import { UrlShortenerTool } from '@/features/links/components/UrlShortenerTool';
import { ContactQrTool } from '@/features/tools/components/ContactQrTool';
import { ImageConverterTool } from '@/features/tools/components/ImageConverterTool';
import { SignatureBuilder } from '@/features/signatures/components/SignatureBuilder';
import { apiFetch } from '@/shared/lib/api';
import { GlassCard } from '@/shared/components/ui/GlassCard';
import { useDashboard } from '@/shared/contexts/DashboardContext';
import { 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Sparkles, 
  ArrowRight,
  QrCode,
  Zap,
  Activity,
  BarChart3
} from 'lucide-react';
import { cn } from "@/shared/lib/utils";

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

  const [links, setLinks] = useState<any[]>([]);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await apiFetch<any[]>('/api/management/links/list');
        setLinks(data || []);
      } catch (error) {
        setLinks([]);
      } finally {
        setIsLoadingLinks(false);
      }
    };
    fetchLinks();
  }, []);

  const tools = [
    { 
      id: 'shortener', 
      category: 'shortener',
      name: 'Acortador de Enlaces', 
      description: 'Crea enlaces cortos inteligentes con analíticas en tiempo real.',
      icon: LinkIcon, 
      color: 'bg-brand-turquoise/10 text-brand-turquoise'
    },
    { 
      id: 'signature', 
      category: 'signature',
      name: 'Generador de Firmas B2B', 
      description: 'Crea firmas de correo profesionales y conectadas.',
      icon: ImageIcon, 
      color: 'bg-brand-magenta/10 text-brand-magenta'
    },
    { 
      id: 'qr', 
      category: 'qr',
      name: 'Generador QR Pro', 
      description: 'Códigos QR multipropósito dinámicos y personalizables.',
      icon: QrCode, 
      color: 'bg-brand-mustard/10 text-brand-mustard'
    },
    {
      id: 'image-converter',
      category: 'image-converter',
      name: 'Convertidor de Imágenes',
      description: 'Convierte imágenes entre formatos al instante y sin pérdida.',
      icon: Zap,
      color: 'bg-slate-900/10 text-slate-900'
    }
  ];

  const filteredTools = activeTab === 'all' || activeTab === 'top'
    ? tools 
    : tools.filter(t => t.category === activeTab);

  const stats = [
    { label: 'Clics totales', value: '0', icon: Activity, trend: '0%' },
    { label: 'Enlaces activos', value: links.length.toString(), icon: Zap, trend: '0' },
    { label: 'Tasa conv.', value: '0%', icon: BarChart3, trend: '0%' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'shortener':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <UrlShortenerTool />
          </div>
        );
      case 'signature':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <SignatureBuilder />
          </div>
        );
      case 'qr':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <ContactQrTool />
          </div>
        );
      case 'image-converter':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <ImageConverterTool />
          </div>
        );
      case 'top':
      case 'all':
      default:
        return (
          <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in duration-700">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-brand-turquoise font-black text-[10px] uppercase tracking-[0.25em]">
                  <Sparkles size={14} className="animate-pulse" />
                  Centro de Control
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-[-0.04em] leading-tight">
                  Bienvenido de nuevo
                </h1>
                <p className="text-slate-400 font-bold text-sm sm:text-base capitalize">
                  {currentDate}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 w-full">
                {isLoadingLinks ? (
                  <div className="h-24 w-full max-w-md bg-slate-100 animate-pulse rounded-2xl"></div>
                ) : links.length > 0 ? (
                  stats.map((stat) => (
                    <div key={stat.label} className="flex flex-col gap-1 rounded-2xl bg-white border border-slate-100 p-5 shadow-sm min-w-[140px]">
                      <div className="flex items-center justify-between">
                        <stat.icon size={18} className="text-slate-400" />
                        <span className="text-[10px] font-black text-slate-400">{stat.trend}</span>
                      </div>
                      <span className="text-2xl font-black text-slate-900">{stat.value}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-start gap-4 p-5 md:p-8 bg-slate-50 rounded-2xl border border-slate-100 w-full max-w-md">
                    <p className="text-sm font-bold text-slate-600">Tus estadísticas aparecerán aquí cuando crees tu primer enlace.</p>
                    <button onClick={() => setActiveTab('shortener')} className="px-5 py-2.5 bg-brand-turquoise text-white text-sm font-bold rounded-full hover:bg-brand-turquoise/90 transition-colors shadow-sm">
                      Crear Enlace
                    </button>
                  </div>
                )}
              </div>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {filteredTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className="group text-left w-full transition-all duration-500 hover:-translate-y-1"
                >
                  <GlassCard className="h-full flex flex-col items-start gap-4 cursor-pointer rounded-[2.5rem] border-2 border-transparent transition-all group-hover:border-brand-turquoise/20 group-hover:shadow-[0_40px_80px_-16px_rgba(0,0,0,0.1)] p-5 md:p-6">
                    <div className={cn("p-5 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3", tool.color)}>
                      <tool.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-lg md:text-xl mb-3 tracking-tight truncate w-full">{tool.name}</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">{tool.description}</p>
                    </div>
                    <div className="mt-auto pt-8 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-brand-turquoise opacity-60 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                      Abrir Herramienta <ArrowRight size={16} />
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
    <div className="flex flex-col w-full max-w-7xl mx-auto py-4 md:py-6 px-4 md:px-6 lg:px-8 min-h-screen">
      {renderContent()}
    </div>
  );
}