"use client";

import React, { useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Link as LinkIcon, 
  Share2, 
  QrCode, 
  Wifi, 
  Search, 
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';
import { GlassCard } from '@/shared/components/ui/GlassCard';
import { BackgroundGlow } from '@/shared/components/ui/BackgroundGlow';

// Herramientas
import { UrlShortenerTool } from '@/features/links/components/UrlShortenerTool';
import { BiolinkBuilder } from '@/features/dashboard/components/BiolinkBuilder';
import QrCodeDisplay from '@/features/tools/components/QrCodeDisplay';
import { WifiQrGenerator } from '@/features/tools/components/WifiQrGenerator';
import OpenGraphPreview from '@/features/tools/components/OpenGraphPreview';

const TOOLS = [
  {
    id: 'shortener',
    title: 'Acortador de URL',
    description: 'Links cortos y rastreables en segundos',
    icon: LinkIcon,
    component: UrlShortenerTool,
    color: 'turquoise'
  },
  {
    id: 'biolink',
    title: 'Biolink Builder',
    description: 'Tu tarjeta de presentación digital para redes sociales',
    icon: Share2,
    component: BiolinkBuilder,
    color: 'magenta'
  },
  {
    id: 'qr',
    title: 'Generador QR',
    description: 'Crea códigos QR personalizados para cualquier texto',
    icon: QrCode,
    component: QrCodeDisplay,
    color: 'mustard'
  },
  {
    id: 'opengraph',
    title: 'OpenGraph Preview',
    description: 'Analiza cómo se ven tus links en redes sociales',
    icon: Search,
    component: OpenGraphPreview,
    color: 'magenta'
  }
];

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeToolId = searchParams.get('tool') || 'shortener';

  const activeTool = useMemo(() => 
    TOOLS.find(t => t.id === activeToolId) || TOOLS[0], 
    [activeToolId]
  );

  const otherTools = useMemo(() => 
    TOOLS.filter(t => t.id !== activeTool.id), 
    [activeTool.id]
  );

  const ActiveComponent = activeTool.component;

  return (
    <main className="relative min-h-screen bg-slate-50/50 pt-24 pb-16 px-6">
      <BackgroundGlow color="turquoise" className="left-[-10%] top-[-5%] h-[40rem] w-[40rem] opacity-30" />
      <BackgroundGlow color="magenta" className="right-[-10%] bottom-[-5%] h-[30rem] w-[30rem] opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-brand-turquoise font-bold text-xs uppercase tracking-widest mb-3">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard / Herramientas</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            {activeTool.title}
          </h1>
        </header>

        {/* Área Activa */}
        <section className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ActiveComponent />
        </section>

        {/* Explorador */}
        <section className="border-t border-slate-200 pt-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Explorar herramientas</h2>
              <p className="text-slate-500 mt-1">Potencia tu flujo de trabajo con nuestra suite completa</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <GlassCard 
                  key={tool.id}
                  onClick={() => {
                    router.push(`?tool=${tool.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group p-8 cursor-pointer hover:border-brand-turquoise/50 transition-all hover:shadow-2xl hover:shadow-brand-turquoise/5 border-slate-200/60 bg-white/40"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:scale-110 group-hover:border-brand-turquoise/20 transition-all duration-300">
                      <Icon className={`w-8 h-8 text-brand-${tool.color}`} />
                    </div>
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-slate-100/50 group-hover:bg-brand-turquoise/10 group-hover:text-brand-turquoise transition-colors">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{tool.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{tool.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
