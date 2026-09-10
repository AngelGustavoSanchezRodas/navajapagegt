"use client";

import { useState, useRef } from "react";
import { Link, Loader2, QrCode, Copy, Check, ExternalLink, Settings2, RefreshCcw, Lock, Clock, Trash2, ArrowRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/shared/components/ui/GlassCard";
import { ProUpgradeModal } from "@/shared/components/ui/ProUpgradeModal";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";
import { cn } from "@/shared/lib/utils";
import { useUrlShortener } from "../hooks/useUrlShortener";

export function UrlShortenerTool() {
  const {
    url,
    setUrl,
    alias,
    setAlias,
    loading,
    error,
    setError,
    shortUrl,
    recentLinks,
    removeRecentLink,
    isModalOpen,
    setIsModalOpen,
    modalMessage,
    setModalMessage,
    plan,
    handleSubmit,
    handleReset
  } = useUrlShortener();

  const [showAdvanced, setShowAdvanced] = useState(false);
  const { copy, copied } = useCopyToClipboard();
  const resultInputRef = useRef<HTMLInputElement>(null);

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
    <div className="mx-auto w-full max-w-xl space-y-8">
      {/* Form Card */}
      <div className="rounded-[2.5rem] bg-white border border-slate-200 p-4 md:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-[950] text-slate-900 tracking-tight">Acortador Rápido</h3>
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
      </div>

      {/* Recent Links Section */}
      <div className="w-full">
        <h4 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 mb-4 px-2">
          <Clock size={16} /> Enlaces Recientes
        </h4>

        {recentLinks.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition-all hover:border-brand-turquoise/30">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
              <Link size={20} />
            </div>
            <h5 className="text-sm font-bold text-slate-900 mb-1">Aún no hay enlaces</h5>
            <p className="text-xs font-medium text-slate-500">
              Tus últimos enlaces acortados aparecerán aquí para un acceso rápido.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {recentLinks.map((link) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "group relative flex items-center justify-between rounded-2xl border p-4 transition-all shadow-sm bg-white",
                    link.status === "error" ? "border-red-200 bg-red-50/50" : "border-slate-100 hover:border-brand-turquoise/30"
                  )}
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className={cn(
                      "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
                      link.status === "processing" ? "bg-slate-100 text-slate-400" :
                      link.status === "error" ? "bg-red-100 text-red-500" :
                      "bg-brand-turquoise/10 text-brand-turquoise"
                    )}>
                      {link.status === "processing" ? <Loader2 size={18} className="animate-spin" /> : 
                       link.status === "error" ? <AlertCircle size={18} /> : 
                       <Link size={18} />}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-bold text-slate-900">
                          {link.status === "processing" ? "Generando alias..." : 
                           link.status === "error" ? "Error al acortar" : 
                           link.shortUrl?.replace(/^https?:\/\//, '')}
                        </span>
                        {link.status === "success" && link.shortUrl && (
                          <button 
                            onClick={() => { copy(link.shortUrl!); toast.success("Copiado al portapapeles"); }}
                            className="text-slate-400 hover:text-brand-turquoise transition-colors"
                            aria-label="Copiar link"
                          >
                            <Copy size={14} />
                          </button>
                        )}
                      </div>
                      <span className="truncate text-xs font-medium text-slate-500">
                        {link.originalUrl}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeRecentLink(link.id)}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    aria-label="Eliminar de recientes"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ProUpgradeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        message={modalMessage} 
      />
    </div>
  );
}
