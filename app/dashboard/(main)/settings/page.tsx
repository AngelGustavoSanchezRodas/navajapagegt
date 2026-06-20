"use client";

import React from 'react';
import { Wrench } from 'lucide-react';

import { useAuth } from '@/shared/contexts/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="w-full max-w-2xl mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-[1000] text-slate-900 tracking-tight mb-2">Configuración de Perfil</h1>
        <p className="text-slate-500 font-medium">Gestiona tu información personal y preferencias de la cuenta.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 relative overflow-hidden">
        {/* Overlay para deshabilitar visualmente y mostrar aviso */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
           <span className="mb-4 inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg">
             Próximamente
           </span>
           <h3 className="text-xl font-bold text-slate-900 mb-2">Módulo en Desarrollo</h3>
           <p className="text-sm font-medium text-slate-600 max-w-sm">Pronto podrás editar tu información personal y cambiar tu contraseña desde este panel.</p>
        </div>

        <form className="space-y-6 opacity-50 select-none pointer-events-none">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre Completo</label>
            <input 
              type="text" 
              disabled 
              value={user?.nombre || 'Usuario Demo'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Correo Electrónico</label>
            <input 
              type="email" 
              disabled 
              value={user?.email || 'usuario@ejemplo.com'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-500"
            />
          </div>
          <button disabled className="w-full bg-brand-turquoise text-white font-bold h-12 rounded-xl mt-4">Guardar Cambios</button>
        </form>
      </div>
    </div>
  );
}
