"use client";

import { FormEvent, useState, useRef } from "react";
import { Link, Loader2, QrCode, Copy, Check, ExternalLink, Settings2, RefreshCcw, Lock } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/shared/components/ui/GlassCard";
import { apiFetch } from "@/shared/lib/api";
import { useAuth } from "@/shared/contexts/AuthContext";
import { ProUpgradeModal } from "@/shared/components/ui/ProUpgradeModal";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";
import { cn } from "@/shared/lib/utils";

interface ShortenResponse {
  alias: string;
  urlOriginal: string;
  shortUrl?: string;
}

export function UrlShortenerTool() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { copy, copied } = useCopyToClipboard();
  const [modalMessage, setModalMessage] = useState<string | undefined>();
  const resultInputRef = useRef<HTMLInputElement>(null);
  
  const { plan } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setShortUrl(null);

    try {
      const response = await apiFetch<any>('/api/core/links/create', {
        method: 'POST',
        body: JSON.stringify({ 
          urlOriginal: url, 
          tipo: 'STANDARD',
          alias: alias || null
        })
      });
      
      const codigo = response.codigoCorto || response.alias;
      setShortUrl(`${window.location.origin}/${codigo}`);
      toast.success("¡Enlace acortado con éxito!");
    } catch (err: unknown) {
      const apiError = err as { status?: number; message?: string };
      if (apiError.status === 402 || apiError.status === 403) {
        setModalMessage(apiError.message || "Tu plan actual no permite realizar esta acción");
        setIsModalOpen(true);
      } else if (apiError.status === 400) {
        setError(apiError.message || "Datos incorrectos");
        toast.error(apiError.message || "Datos incorrectos al acortar el enlace");
      } else if (apiError.status === 409 || apiError.message?.includes('ALIAS_EN_USO')) {
        setError("El alias ya está en uso o es inválido");
      } else {
        setError(apiError.message || "Ocurrió un error inesperado");
        toast.error(apiError.message || "Error al acortar el enlace");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl("");
    setAlias("");
    setShortUrl(null);
    setError(null);
  };

  const handleInputClick = () => {
    if (resultInputRef.current) {
      resultInputRef.current.select();
    }
  };

  const handleCopy = () => {
    if (shortUrl) {
      copy(shortUrl);
    }
  };

  if (shortUrl) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-xl mx-auto">
        <GlassCard className="p-4 md:p-10 border-2 border-brand-turquoise/20 bg-gradient-to-b from-white to-brand-turquoise/5 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl shadow-brand-turquoise/10 relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-brand-turquoise/10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-emerald-400/10 blur-2xl"></div>
          
          <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner relative z-10">
            <Check className="w-8 h-8" />
          </div>
          
          <h4 className="text-2xl font-black text-slate-900 mb-2 relative z-10">¡Link listo para compartir!</h4>
          <p className="text-slate-500 font-medium mb-8 relative z-10">Tu enlace ha sido acortado y está listo para ser utilizado.</p>
          
          <div className="w-full relative z-10 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 flex flex-col gap-6">
            <input
              ref={resultInputRef}
              type="text"
              readOnly
              value={shortUrl}
              onClick={handleInputClick}
              className="w-full bg-slate-50 border-none outline-none text-center text-2xl sm:text-3xl font-black text-brand-turquoise py-4 rounded-xl cursor-pointer"
            />
            
            <button
              onClick={handleCopy}
              className="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-2xl text-lg font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-slate-900/20"
            >
              {copied ? (
                <>
                  <Check className="h-6 w-6" /> ¡COPIADO AL PORTAPAPELES!
                </>
              ) : (
                <>
                  <Copy className="h-6 w-6" /> COPIAR ENLACE
                </>
              )}
            </button>
          </div>
          
          <div className="flex items-center gap-4 relative z-10">
            <a 
              href={shortUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-brand-turquoise hover:border-brand-turquoise/30 transition-all shadow-sm"
            >
              <ExternalLink size={16} />
              Probar Link
            </a>
            
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-brand-turquoise hover:border-brand-turquoise/30 transition-all shadow-sm"
            >
              <RefreshCcw size={16} />
              Crear Otro
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-[2.5rem] bg-white border border-slate-200 p-4 md:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-[950] text-slate-900 tracking-tight">Acortador Rápido</h3>
        {shortUrl && (
          <button 
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-brand-turquoise transition-colors"
          >
            <RefreshCcw size={14} />
            Reiniciar
          </button>
        )}
      </div>
      <p className="text-sm font-medium text-slate-500 mb-8">Genera links rastreables y seguros en milisegundos.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
              <Link className="h-4 w-4 text-slate-400" />
            </div>
            <input
              id="shortener-url"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="Pega tu enlace largo aquí..."
              className="h-16 w-full rounded-2xl bg-slate-50 border border-transparent pl-12 pr-4 text-base text-slate-900 outline-none transition-all focus:bg-white focus:border-brand-turquoise/30 focus:ring-4 focus:ring-brand-turquoise/5 placeholder:text-slate-400 font-medium"
              required
            />
          </div>

          <button 
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex w-fit items-center gap-2 px-1 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors"
          >
            <Settings2 size={14} />
            {showAdvanced ? "Opciones avanzadas" : "Personalizar enlace"}
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 pt-1 pb-2">
                  <div className="flex items-center justify-between px-1">
                    <label htmlFor="shortener-alias" className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Alias Personalizado
                    </label>
                    {plan === 'FREE' && (
                      <div className="flex items-center gap-1 bg-gradient-to-r from-brand-magenta to-brand-magenta/80 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
                        <Lock size={10} />
                        PRO
                      </div>
                    )}
                  </div>

                  <div className="relative flex items-center group">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                      <span className="text-sm font-bold text-slate-400 italic">@</span>
                    </div>
                    
                    <input
                      id="shortener-alias"
                      type="text"
                      value={alias}
                      onChange={(event) => { setAlias(event.target.value); setError(null); }}
                      placeholder={plan === 'FREE' ? "Desbloquea Premium para personalizar" : "tu-alias-aqui"}
                      disabled={plan === 'FREE'}
                      className={cn(
                        "h-16 w-full rounded-2xl border pl-12 pr-12 text-base outline-none transition-all font-medium shadow-sm",
                        plan === 'FREE' 
                          ? 'bg-slate-100 border-transparent text-slate-400 cursor-not-allowed' 
                          : error?.includes('alias') || error?.includes('Alias')
                            ? 'border-red-500 bg-red-50 text-red-900 focus:ring-4 focus:ring-red-500/10 placeholder:text-red-300'
                            : 'border-transparent bg-slate-50 text-slate-900 focus:bg-white focus:border-brand-turquoise/30 focus:ring-4 focus:ring-brand-turquoise/5'
                      )}
                    />

                    {plan === 'FREE' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setModalMessage("La personalización de alias es una función exclusiva para usuarios PRO.");
                          setIsModalOpen(true);
                        }}
                        className="absolute inset-0 z-20 w-full h-full cursor-pointer rounded-2xl bg-transparent"
                        aria-label="Desbloquear Alias Premium"
                      />
                    )}

                    {plan === 'FREE' && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
                        <Lock className="h-5 w-5 text-slate-300 group-hover:text-brand-magenta transition-colors" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex h-16 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-brand-turquoise px-8 text-base font-black text-white transition-all hover:opacity-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 shadow-lg shadow-brand-turquoise/20"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Procesando</span>
              </>
            ) : (
              <>
                <QrCode className="h-5 w-5 transition-transform group-hover:rotate-12" />
                <span>Acortar ahora</span>
              </>
            )}
          </button>
        </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm animate-in fade-in slide-in-from-top-2 font-bold text-center">
          {error}
        </div>
      )}

      <ProUpgradeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        message={modalMessage} 
      />
    </div>
  );
}
