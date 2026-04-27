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
        <GlassCard className="flex flex-col items-center justify-center space-y-6 p-8 bg-white/40 backdrop-blur-xl border border-white/20 animate-in fade-in zoom-in-95">
          <div className="relative p-4 bg-white rounded-2xl shadow-inner border border-zinc-100">
            <Image
              src={qrUrl}
              alt={`Código QR para ${text}`}
              width={192}
              height={192}
              className="rounded-lg"
              unoptimized
            />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-zinc-900">Tu Código QR</h3>
            <p className="text-xs text-zinc-500 max-w-[250px] truncate">
              {text}
            </p>
          </div>

          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center space-x-2 py-3 px-6 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-all transform active:scale-95 shadow-lg"
          >
            <Download className="w-5 h-5" />
            <span>Descargar PNG</span>
          </button>
        </GlassCard>
      )}
    </div>
  );
};

export default QrCodeDisplay;
