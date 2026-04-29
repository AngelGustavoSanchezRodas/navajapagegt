"use client";

import React from 'react';
import { Settings } from 'lucide-react';
import { EmptyState } from '@/shared/components/ui/EmptyState';

export default function SettingsPage() {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto py-16 px-6 lg:px-10 min-h-screen animate-in fade-in slide-in-from-bottom-8 duration-500">
      <header className="mb-12">
        <h1 className="text-4xl font-[1000] text-slate-900 tracking-[-0.04em]">
          Configuración
        </h1>
        <p className="mt-2 text-slate-500 font-medium text-lg">
          Administra tus preferencias de cuenta
        </p>
      </header>
      <EmptyState
        icon={Settings}
        title="Próximamente"
        description="Estamos trabajando en el panel de configuración avanzado. Vuelve pronto para explorar todas las opciones."
      />
    </div>
  );
}
