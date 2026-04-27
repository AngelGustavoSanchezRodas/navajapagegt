"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Wifi, Loader2, Download, QrCode } from 'lucide-react';
import { GlassCard } from '@/shared/components/ui/GlassCard';
import { apiFetch } from '@/shared/lib/api';

export const WifiQrGenerator = () => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryptionType, setEncryptionType] = useState('WPA');
  const [isLoading, setIsLoading] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setQrImageUrl(null);

    try {
      const blob = await apiFetch<Blob>('/api/v1/tools/qr/wifi', {
        method: 'POST',
        responseType: 'blob',
        body: JSON.stringify({ ssid, password, encryptionType })
      });

      const url = URL.createObjectURL(blob);
      setQrImageUrl(url);
    } catch (error) {
      console.error('Error generando QR:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="max-w-md mx-auto p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-brand-turquoise/10 rounded-lg">
          <Wifi className="w-6 h-6 text-brand-turquoise" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">QR Wi-Fi</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de Red (SSID)</label>
          <input
            type="text"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-turquoise/20 outline-none transition-all"
            placeholder="Ej. Mi Casa"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-turquoise/20 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Seguridad</label>
          <select
            value={encryptionType}
            onChange={(e) => setEncryptionType(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-turquoise/20 outline-none transition-all appearance-none bg-white"
          >
            <option value="WPA">WPA/WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">Sin contraseña</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-brand-turquoise text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <QrCode className="w-5 h-5" />}
          <span>Generar Código QR</span>
        </button>
      </form>

      {qrImageUrl && (
        <div className="mt-8 flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
          <div className="p-4 bg-white rounded-2xl shadow-inner border border-slate-100">
            <Image 
              src={qrImageUrl} 
              alt="Wi-Fi QR Code" 
              width={192} 
              height={192} 
              className="rounded-xl" 
              unoptimized 
            />
          </div>
          <a
            href={qrImageUrl}
            download="wifi-qr.png"
            className="mt-4 flex items-center space-x-2 text-brand-turquoise font-bold text-sm hover:underline"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Imagen</span>
          </a>
        </div>
      )}
    </GlassCard>
  );
};
