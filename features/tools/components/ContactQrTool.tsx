"use client";

import React, { useState } from 'react';
import { GlassCard } from '@/shared/components/ui/GlassCard';
import { QrCode, Link as LinkIcon, Phone, Mail, ArrowRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type QrType = 'url' | 'tel' | 'email';

export const ContactQrTool: React.FC = () => {
  const [type, setType] = useState<QrType>('url');
  const [value, setValue] = useState('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    let finalValue = value;
    if (type === 'tel') finalValue = `tel:${value}`;
    if (type === 'email') finalValue = `mailto:${value}`;

    const encodedValue = encodeURIComponent(finalValue);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    setQrUrl(`${apiUrl}/api/v1/tools/qr?url=${encodedValue}`);
  };

  return (
    <GlassCard className="p-8 max-w-2xl mx-auto rounded-[2.5rem]">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-brand-turquoise/10 text-brand-turquoise rounded-2xl">
          <QrCode className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Generador QR Pro</h2>
          <p className="text-sm text-slate-500 font-medium">Crea códigos QR para enlaces, llamadas o correos.</p>
        </div>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
        {(['url', 'tel', 'email'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setType(t); setValue(''); setQrUrl(null); }}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              type === t ? "bg-white text-brand-turquoise shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
            {type === 'url' ? 'Dirección URL' : type === 'tel' ? 'Número de Teléfono' : 'Correo Electrónico'}
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {type === 'url' && <LinkIcon size={18} />}
              {type === 'tel' && <Phone size={18} />}
              {type === 'email' && <Mail size={18} />}
            </div>
            <input
              type={type === 'email' ? 'email' : 'text'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'url' ? 'https://ejemplo.com' : type === 'tel' ? '+34 600 000 000' : 'hola@ejemplo.com'}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-turquoise/20 focus:bg-white rounded-2xl outline-none transition-all text-slate-900 font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-brand-turquoise text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-turquoise/90 transition-all shadow-lg shadow-brand-turquoise/20"
        >
          Generar Código QR <ArrowRight size={18} />
        </button>
      </form>

      {qrUrl && (
        <div className="mt-12 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
          <div className="p-4 bg-white rounded-[2rem] border-2 border-slate-100 shadow-xl">
            <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
          </div>
          <p className="mt-4 text-xs font-black uppercase tracking-widest text-slate-400">Escanea para probar</p>
        </div>
      )}
    </GlassCard>
  );
};
