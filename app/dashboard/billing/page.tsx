"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Building2, UploadCloud, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BackgroundGlow } from "@/shared/components/ui/BackgroundGlow";
import { BrandLogo } from "@/shared/components/layout/BrandLogo";
import { GlassCard } from "@/shared/components/ui/GlassCard";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";

export default function BillingPage() {
  const { copy } = useCopyToClipboard();
  const [isUploaded, setIsUploaded] = useState(false);

  const handleCopy = (text: string) => {
    copy(text, 'Dato copiado al portapapeles');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
      <BackgroundGlow color="turquoise" className="left-[-10%] top-[-10%] w-[50rem] h-[50rem] opacity-30" />
      <BackgroundGlow color="mustard" className="right-[-10%] bottom-[-10%] w-[40rem] h-[40rem] opacity-20" />

      {/* Header Minimalista */}
      <header className="w-full flex items-center justify-between p-6 relative z-10">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2">
          <BrandLogo />
        </div>
        <div className="w-[72px]"></div> {/* Espaciador para centrar el logo */}
      </header>

      {/* Contenedor Central */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <GlassCard className="max-w-md w-full mx-auto p-8 sm:p-10 flex flex-col items-center text-center shadow-2xl rounded-[2.5rem]">
          {isUploaded ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="mb-4 text-2xl font-[1000] text-slate-900 tracking-tight">
                ¡Comprobante Recibido!
              </h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                Estamos procesando tu activación. Tu cuenta será verificada en un plazo máximo de 2 horas.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-turquoise/10 text-brand-turquoise">
                <Building2 className="w-8 h-8" strokeWidth={2} />
              </div>
              <span className="mb-4 inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                Paso 1 de 2
              </span>
              <h1 className="mb-4 text-2xl font-[1000] text-slate-900 tracking-tight">
                Transferencia Bancaria
              </h1>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                Realiza el depósito o transferencia a la siguiente cuenta para activar tu plan PRO.
              </p>
              
              {/* Sección Datos Bancarios One-Tap */}
              <div className="w-full space-y-6 text-left">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Número de Cuenta Monetaria</p>
                  <button 
                    onClick={() => handleCopy('1234 5678 90')}
                    className="flex items-center justify-between w-full p-4 mt-2 bg-zinc-50 border border-zinc-200 rounded-xl active:bg-zinc-100 transition-colors hover:border-brand-turquoise/30"
                  >
                    <span className="text-lg font-mono font-bold text-slate-900">1234 5678 90</span>
                    <Copy className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Monto Exacto</p>
                  <button 
                    onClick={() => handleCopy('15.00')}
                    className="flex items-center justify-between w-full p-4 mt-2 bg-zinc-50 border border-zinc-200 rounded-xl active:bg-zinc-100 transition-colors hover:border-brand-turquoise/30"
                  >
                    <span className="text-lg font-mono font-bold text-slate-900">$15.00</span>
                    <Copy className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Zona de Carga (Dropzone) */}
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-300 rounded-2xl cursor-pointer bg-zinc-50 hover:bg-zinc-100 mt-8 transition-colors group">
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*,application/pdf" 
                  onChange={() => setIsUploaded(true)} 
                />
                <UploadCloud className="w-8 h-8 text-zinc-400 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-zinc-500 px-4 text-center">
                  Toca para subir comprobante (Imagen o PDF)
                </span>
              </label>
            </>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
