"use client";

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/shared/components/ui/GlassCard';
import Image from 'next/image';
import { Search, Globe, ExternalLink } from 'lucide-react';

interface OGData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

interface Props {
  url?: string;
}

const OpenGraphPreview: React.FC<Props> = ({ url: initialUrl }) => {
  const [url, setUrl] = useState(initialUrl || '');
  const [data, setData] = useState<OGData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url || !url.startsWith('http')) {
      setData(null);
      return;
    }

    const fetchOG = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tools/opengraph?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error('Error al obtener la previsualización');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchOG, 500);
    return () => clearTimeout(timeout);
  }, [url]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {!initialUrl && (
        <GlassCard className="p-6">
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">
            URL del Sitio Web
          </label>
          <div className="relative flex items-center">
            <Globe className="absolute left-4 w-5 h-5 text-slate-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://ejemplo.com"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-turquoise/20 outline-none transition-all"
            />
          </div>
        </GlassCard>
      )}

      {loading && (
        <div className="w-full border border-zinc-200 rounded-2xl overflow-hidden animate-pulse bg-white">
          <div className="w-full h-64 bg-zinc-100" />
          <div className="p-6 space-y-4">
            <div className="h-6 bg-zinc-100 rounded w-3/4" />
            <div className="h-4 bg-zinc-100 rounded w-full" />
            <div className="h-4 bg-zinc-100 rounded w-5/6" />
          </div>
        </div>
      )}

      {data && !loading && (
        <div className="w-full border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all group animate-in fade-in slide-in-from-bottom-4">
          {data.image && (
            <div className="relative w-full h-64 overflow-hidden border-b border-zinc-100">
              <Image
                src={data.image}
                alt={data.title || "Preview"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />
            </div>
          )}
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-brand-turquoise uppercase tracking-widest flex items-center gap-2">
                <Globe className="w-3 h-3" />
                {new URL(url).hostname}
              </p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-brand-turquoise transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <h4 className="text-xl font-bold text-zinc-900 line-clamp-2">{data.title}</h4>
            <p className="text-base text-zinc-600 line-clamp-3 leading-relaxed">
              {data.description}
            </p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center font-medium animate-in shake duration-500">
          No se pudo generar la previsualización para esta URL.
        </div>
      )}
    </div>
  );
};

export default OpenGraphPreview;
