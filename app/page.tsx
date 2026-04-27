"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { User } from 'lucide-react';
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
    setIsAuthenticated(!!Cookies.get("token"));
  }, []);

  const renderActiveTool = () => {
    if (isAuthenticated) {
      return (
        <div className="w-full max-w-3xl animate-in fade-in zoom-in duration-700">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white/40 p-12 text-center backdrop-blur-xl border border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_48px_80px_-24px_rgba(0,0,0,0.15)]">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-turquoise/5 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-brand-magenta/5 blur-3xl" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-turquoise/10 text-brand-turquoise shadow-inner shadow-brand-turquoise/20">
                <User size={40} className="drop-shadow-sm" />
              </div>
              
              <h2 className="mb-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                ¡Bienvenido de nuevo!
              </h2>
              <p className="mb-10 max-w-md text-lg font-medium text-slate-600 leading-relaxed">
                Tu panel de control está listo. Gestiona tus enlaces, biolinks y analíticas desde un solo lugar.
              </p>
              
              <Link
                href="/dashboard"
                className="group flex items-center gap-4 rounded-2xl bg-slate-900 px-10 py-5 text-xl font-bold text-white transition-all hover:bg-black hover:scale-105 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] active:scale-95"
              >
                Ir a mi Workspace ➔
              </Link>
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
      <BackgroundGlow
        color="turquoise"
        className="left-[-10%] top-[-5%] h-[40rem] w-[40rem] opacity-40"
      />
      <BackgroundGlow
        color="magenta"
        className="right-[-10%] top-[10%] h-[30rem] w-[30rem] opacity-30"
      />
      <BackgroundGlow
        color="mustard"
        className="bottom-[20%] left-[10%] h-[35rem] w-[35rem] opacity-20"
      />

      <div className="relative z-10">
        {/* Hero Section: Centered Layout */}
        <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-28 pb-20 text-center md:pt-36">
          <div className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-brand-turquoise/20 bg-brand-turquoise/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-brand-turquoise shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-brand-turquoise shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
            NavajaGT 2.0 • El Futuro es Hoy
          </div>
          
          <h1 className="mb-8 max-w-4xl text-5xl font-[950] tracking-[-0.04em] text-slate-900 md:text-7xl lg:text-8xl">
            Gestiona tu Mundo <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-brand-turquoise via-emerald-500 to-brand-turquoise bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">Digital</span>
          </h1>
          
          <p className="mb-14 max-w-2xl text-xl font-medium leading-relaxed text-slate-500/90 md:text-2xl">
            La plataforma definitiva para biolinks premium, acortadores inteligentes y herramientas digitales avanzadas.
          </p>
          
          <div className="flex w-full items-center justify-center px-2">
            {!isMounted ? (
               <div className="h-[400px] w-full max-w-3xl animate-pulse rounded-[2.5rem] bg-white/50 backdrop-blur-sm" />
            ) : renderActiveTool()}
          </div>

          {!isAuthenticated && (
            <div className="mt-16 flex flex-wrap justify-center gap-4">
              {['Enlaces', 'Biolinks', 'Seguridad QR', 'Analítica'].map((cat) => (
                <span 
                  key={cat}
                  className="rounded-full bg-white/80 px-8 py-3 text-sm font-bold text-slate-600 shadow-sm ring-1 ring-slate-100 transition-all hover:scale-105 hover:bg-white hover:text-brand-turquoise hover:shadow-md cursor-default"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Features Grid */}
        <section className="pb-24 pt-12">
          <div className="mb-16 text-center px-4">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">Herramientas Profesionales</h2>
            <p className="mt-4 text-lg font-medium text-slate-500 max-w-xl mx-auto">Potencia tu presencia digital con nuestro ecosistema de herramientas de alto rendimiento.</p>
          </div>
          <FeaturesGrid onSelectTool={setActiveTool} />
        </section>

        {/* Benefits Section */}
        <BenefitsSection />
      </div>
    </main>
  );
}
