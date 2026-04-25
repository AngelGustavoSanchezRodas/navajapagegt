"use client";

import { FormEvent, useState } from "react";
import { Link, Loader2, QrCode, Copy, Check } from "lucide-react";
import { GlassCard } from "@/shared/components/ui/GlassCard";
import { apiFetch } from "@/shared/lib/api";

export function UrlShortenerTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessUrl(null);

    try {
      const response: any = await apiFetch('/api/v1/core/enlaces', {
        method: 'POST',
        body: JSON.stringify({ 
          urlOriginal: url, 
          tipo: 'STANDARD' 
        })
      });
      
      const baseUrl = window.location.origin;
      setSuccessUrl(`${baseUrl}/${response.alias}`);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (successUrl) {
      navigator.clipboard.writeText(successUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <GlassCard className="mx-auto w-full max-w-xl border-none p-6 sm:p-8 shadow-2xl shadow-brand-turquoise/10">
      <h3 className="text-xl font-bold text-slate-900 mb-2">Acortador Rápido</h3>
      <p className="text-sm text-slate-500 mb-6">Genera links rastreables y seguros en milisegundos.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Link className="h-4 w-4 text-slate-400" />
          </div>
          <input
            id="shortener-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="Pega tu enlace largo aquí..."
            className="h-14 w-full rounded-2xl bg-white/50 pl-12 pr-4 text-base text-slate-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-brand-turquoise/20 placeholder:text-slate-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-brand-turquoise px-8 text-base font-semibold text-white transition-all hover:scale-[1.02] hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Procesando</span>
            </>
          ) : (
            <>
              <QrCode className="h-4 w-4 transition-transform group-hover:rotate-12" />
              <span>Acortar ahora</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {successUrl && (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in fade-in slide-in-from-top-4">
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">¡Link generado!</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={successUrl}
              className="flex-1 bg-white/50 border-none outline-none text-sm text-slate-900 px-3 py-2 rounded-lg"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
