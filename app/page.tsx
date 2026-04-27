"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { LayoutDashboard, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { BackgroundGlow } from "@/shared/components/ui/BackgroundGlow";
import { FeaturesGrid } from "@/features/landing/components/FeaturesGrid";
import { BenefitsSection } from "@/features/landing/components/BenefitsSection";
import { UrlShortenerTool } from "@/features/links/components/UrlShortenerTool";
import BiolinkBuilder from '@/features/dashboard/components/BiolinkBuilder';
import { ContactQrTool } from '@/features/tools/components/ContactQrTool';

export default function Home() {
  const [activeTool, setActiveTool] = useState("shortener");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = Cookies.get("token");
    setIsAuthenticated(!!token);
  }, []);

  const renderActiveTool = () => {
    if (isAuthenticated) {
      return (
        <div className="w-full max-w-4xl animate-in fade-in zoom-in slide-in-from-bottom-8 duration-1000">
          <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-b from-white/80 to-white/40 p-1 md:p-1.5 backdrop-blur-2xl border border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-turquoise/10 blur-[100px] animate-pulse" />
            <div className="absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-brand-magenta/10 blur-[100px] animate-pulse" />
            
            <div className="relative z-10 rounded-[2.8rem] bg-white/50 px-8 py-16 md:px-12 md:py-20 flex flex-col items-center text-center">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-slate-900 text-white shadow-2xl shadow-slate-200 rotate-3 hover:rotate-0 transition-transform duration-500">
                <Sparkles size={48} className="text-brand-turquoise animate-pulse" fill="currentColor" />
              </div>
              
              <h2 className="mb-4 text-4xl font-[950] tracking-tight text-slate-900 md:text-6xl">
                ¡Hola de nuevo!
              </h2>
              <p className="mb-12 max-w-xl text-xl font-medium text-slate-500/90 leading-relaxed">
                Tu ecosistema digital está listo para la acción. Continúa gestionando tus enlaces y Biolinks con herramientas de alto rendimiento.
              </p>
              
              <Link
                href="/dashboard"
                className="group relative flex items-center gap-6 overflow-hidden rounded-full bg-slate-900 px-12 py-6 text-2xl font-black text-white transition-all hover:bg-black hover:scale-105 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Continuar en mi Dashboard
                  <ArrowRight size={28} className="transition-transform group-hover:translate-x-2" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-turquoise/0 via-white/10 to-brand-turquoise/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Link>
              
              <div className="mt-12 flex items-center gap-8 text-slate-400 font-bold text-xs uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-brand-turquoise" />
                  Sincronizado
                </div>
                <div className="h-1 w-1 rounded-full bg-slate-200" />
                <div className="flex items-center gap-2">
                  <LayoutDashboard size={14} className="text-brand-magenta" />
                  Premium UI
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (activeTool) {
      case 'biolink':
        return <BiolinkBuilder />;
      case 'qr':
        return <ContactQrTool />;
      default:
        return <UrlShortenerTool />;
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50/30">
      {/* Background Glows */}
      <BackgroundGlow color="turquoise" className="left-[-10%] top-[-5%] h-[40rem] w-[40rem] opacity-30" />
      <BackgroundGlow color="magenta" className="right-[-10%] top-[10%] h-[30rem] w-[30rem] opacity-20" />
      <BackgroundGlow color="mustard" className="bottom-[20%] left-[10%] h-[35rem] w-[35rem] opacity-10" />

      <div className="relative z-10">
        {/* Hero Section: Centered Layout */}
        <section className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-32 pb-24 text-center md:pt-44">
          <div className="mb-12 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 shadow-sm backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-turquoise shadow-[0_0_10px_rgba(20,184,166,0.6)] animate-pulse" />
            Ecosistema Digital 2.0
          </div>
          
          <h1 className="mb-8 max-w-5xl text-6xl font-[1000] tracking-[-0.05em] text-slate-900 md:text-8xl lg:text-9xl leading-[0.9]">
            Potencia tu <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-brand-turquoise via-emerald-500 to-brand-turquoise bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">Presencia</span>
          </h1>
          
          <p className="mb-16 max-w-3xl text-xl font-medium leading-relaxed text-slate-500/80 md:text-2xl lg:text-3xl">
            La plataforma definitiva para biolinks premium y acortadores inteligentes.
          </p>
          
          <div className="flex w-full items-center justify-center px-4">
            {!isMounted ? (
               <div className="h-[450px] w-full max-w-4xl animate-pulse rounded-[3rem] bg-white/50 backdrop-blur-sm border border-white" />
            ) : renderActiveTool()}
          </div>

          {!isAuthenticated && (
            <div className="mt-20 flex flex-wrap justify-center gap-5">
              {['Enlaces', 'Biolinks', 'Seguridad QR', 'Analítica'].map((cat) => (
                <span 
                  key={cat}
                  className="rounded-full bg-white px-8 py-3.5 text-sm font-extrabold text-slate-600 shadow-sm ring-1 ring-slate-100 transition-all hover:scale-105 hover:text-brand-turquoise hover:shadow-xl cursor-default"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Features Grid */}
        <section className="pb-32 pt-16">
          <div className="mb-20 text-center px-4">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 md:text-5xl">Herramientas Profesionales</h2>
            <p className="mt-6 text-xl font-medium text-slate-500 max-w-2xl mx-auto">Tecnología de vanguardia para escalar tu impacto digital al siguiente nivel.</p>
          </div>
          <FeaturesGrid onSelectTool={setActiveTool} />
        </section>

        {/* Benefits Section */}
        <BenefitsSection />
      </div>
    </main>
  );
}
