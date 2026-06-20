"use client";

import React from 'react';
import { LinkList } from '@/features/links/components/LinkList';
import { Sparkles, Plus } from 'lucide-react';
import Link from 'next/link';

export default function LinksPage() {
  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-700 w-full max-w-7xl mx-auto py-16 px-6 lg:px-10 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-brand-turquoise font-black text-[10px] uppercase tracking-[0.25em]">
            <Sparkles size={14} className="animate-pulse" />
            Gestión de Activos
          </div>
          <h1 className="text-5xl font-[1000] text-slate-900 tracking-[-0.04em]">
            Mis Enlaces
          </h1>
          <p className="text-slate-400 font-bold text-lg">
            Monitorea y administra todos tus puntos de contacto digitales.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
        >
          <Plus size={18} />
          Nuevo Enlace
        </Link>
      </header>

      <section>
        <LinkList />
      </section>
    </div>
  );
}
