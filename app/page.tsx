"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from "@/shared/contexts/AuthContext";
import { GlassCard } from "@/shared/components/ui/GlassCard";
import { Code2, LinkIcon, QrCode, Image as ImageIcon } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const tools = [
    {
      title: "Acortador",
      description: "Acorta URLs largas y obtén métricas detalladas de tus clics.",
      href: "/herramientas/acortador",
      icon: LinkIcon,
      color: "text-brand-turquoise",
      bg: "bg-brand-turquoise/10"
    },
    {
      title: "Generador QR",
      description: "Crea códigos QR dinámicos, personalizables y rastreables.",
      href: "/herramientas/qr",
      icon: QrCode,
      color: "text-amber-600",
      bg: "bg-amber-500/10"
    },
    {
      title: "Convertidor de Imágenes",
      description: "Convierte entre formatos JPG, PNG, WEBP, de manera masiva y rápida.",
      href: "/herramientas/convertidor",
      icon: ImageIcon,
      color: "text-brand-magenta",
      bg: "bg-brand-magenta/10"
    },
  ];

  const technologies = [
    { name: "Next.js", description: "Aplicaciones web rápidas y escalables.", color: "text-slate-900", bg: "bg-slate-100" },
    { name: "React", description: "Interfaces modernas y reutilizables.", color: "text-cyan-600", bg: "bg-cyan-50" },
    { name: "TypeScript", description: "Código robusto y mantenible.", color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Tailwind CSS", description: "Diseños consistentes y responsivos.", color: "text-sky-600", bg: "bg-sky-50" },
  ];

  if (!isMounted) return null;

  return (
    <main className="relative min-h-screen bg-slate-50 flex flex-col pt-32 pb-20 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <header className="mb-16 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900">
            {isAuthenticated && user?.nombre ? `Bienvenido ${user.nombre} a NavajaGT` : 'Bienvenido a NavajaGT'}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto">
            Selecciona una herramienta de nuestro ecosistema para comenzar a trabajar.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="group outline-none block h-full">
              <GlassCard className="h-full p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 border-slate-200 group-focus-visible:ring-4 ring-brand-turquoise/20 bg-white">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${tool.bg} ${tool.color}`}>
                  <tool.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{tool.title}</h3>
                <p className="text-base font-medium text-slate-500 leading-relaxed">
                  {tool.description}
                </p>
              </GlassCard>
            </Link>
          ))}
        </div>

        <section className="mt-24">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-turquoise/10 px-4 py-2 text-sm font-bold text-brand-turquoise">
              <Code2 size={16} />
              Tecnologías de AAA Estudio
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Construido con tecnología moderna
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              Utilizamos herramientas actuales para crear soluciones digitales rápidas, seguras y fáciles de mantener.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {technologies.map((technology) => (
              <div
                key={technology.name}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${technology.bg} ${technology.color}`}>
                  <Code2 size={24} />
                </div>
                <h3 className="text-lg font-black text-slate-900">{technology.name}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">{technology.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
