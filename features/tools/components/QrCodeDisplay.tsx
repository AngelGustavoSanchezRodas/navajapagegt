"use client";

import React, { useState } from 'react';
import { GlassCard } from '@/shared/components/ui/GlassCard';
import Image from 'next/image';
import { QrCode, Download, Loader2 } from 'lucide-react';

interface Props {
  text?: string;
}

const QrCodeDisplay: React.FC<Props> = ({ text: initialText }) => {
  const [text, setText] = useState(initialText || '');
  const [isGenerating, setIsGenerating] = useState(false);

  const qrUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools/qr?text=${encodeURIComponent(text)}`;

  const handleDownload = async () => {
    if (!text) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-${text.substring(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      {!initialText && (
        <GlassCard className="p-6">
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
            Texto o URL para el QR
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escribe algo..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-turquoise/20 outline-none transition-all"
          />
        </GlassCard>
      )}

      {text && (
        <GlassCard className="flex flex-col items-center justify-center space-y-6 p-4 md:p-8 bg-white/40 backdrop-blur-xl border border-white/20 animate-in fade-in zoom-in-95">
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-white p-2">
            <Image
              src={qrUrl}
              alt={`Código QR para ${text}`}
              width={192}
              height={192}
              className="rounded-lg object-contain"
              unoptimized
            />
            
            {/* Overlay de Hover */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 bg-brand-turquoise text-white px-4 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:scale-105 text-sm"
              >
                <Download className="w-4 h-4" />
                Descargar
              </button>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-zinc-900">Tu Código QR</h3>
            <p className="text-xs text-zinc-500 max-w-[250px] truncate">
              {text}
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default QrCodeDisplay;
