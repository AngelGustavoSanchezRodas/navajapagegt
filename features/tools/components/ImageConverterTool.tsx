"use client";

import React, { useRef } from "react";
import { AlertCircle, Download, Image as ImageIcon, Loader2, Lock, Upload, X } from "lucide-react";
import { GlassCard } from "@/shared/components/ui/GlassCard";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/shared/contexts/AuthContext";
import { ProUpgradeModal } from "@/shared/components/ui/ProUpgradeModal";
import { DownloadUpsellModal } from "@/shared/components/ui/DownloadUpsellModal";
import { IMAGE_FORMATS, useImageConverter } from "@/features/tools/hooks/useImageConverter";

export function ImageConverterTool() {
  const { plan } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    selectedFormat, files, previews, isConverting, error, isProModalOpen,
    isUpsellModalOpen, modalMessage, isDragging, watermarkFile,
    setIsProModalOpen, setIsUpsellModalOpen, setIsDragging, setWatermarkFile,
    handleFormatSelect, handleFileChange, handleDrop, resetFiles, handleSubmit,
  } = useImageConverter({ plan });

  const handleWatermarkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      event.target.value = "";
      return;
    }
    setWatermarkFile(file);
  };

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <GlassCard className="space-y-8 p-5 sm:p-8 lg:p-10">
        {files.length === 0 ? (
          <div
            className={cn(
              "relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300",
              isDragging
                ? "scale-[1.02] border-brand-turquoise bg-brand-turquoise/5"
                : "border-slate-200 bg-slate-50/50 hover:border-brand-turquoise/50",
            )}
            onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                <ImageIcon className="h-8 w-8" />
              </div>
              <div>
                <span className="block text-lg font-bold text-slate-900">Arrastra tus imágenes aquí</span>
                <span className="mt-1 block text-sm font-medium text-slate-500">
                  {plan === "FREE" ? "Máx. 1 imagen (Actualiza a PRO para lotes)" : "Sube múltiples imágenes a la vez"}
                </span>
              </div>
            </label>
          </div>
        ) : (
          <div className="group relative w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100 shadow-inner">
            <div className="relative flex aspect-[4/3] items-center justify-center p-4 sm:aspect-video">
              <img src={previews[0]} alt="Vista previa principal" className="h-full max-h-[60vh] w-full rounded-xl object-contain drop-shadow-sm" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white">
                <ImageIcon size={14} className="text-brand-turquoise" />
                Formato: {files[0].name.split(".").pop()?.toUpperCase() || "IMG"}
              </div>
              <button
                onClick={() => { resetFiles(); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="absolute right-4 top-4 rounded-full bg-white/90 p-2.5 text-slate-700 opacity-0 shadow-lg transition-all hover:text-red-500 group-hover:opacity-100"
                aria-label="Quitar imágenes"
              >
                <X size={16} />
              </button>
              {files.length > 1 && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-brand-turquoise px-4 py-2.5 text-xs font-black text-white shadow-lg">
                  <span>+ {files.length - 1} imágenes</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Formato de salida</h3>
          <div className="flex flex-wrap gap-2">
            {IMAGE_FORMATS.map((format) => (
              <button
                key={format.id}
                onClick={() => handleFormatSelect(format.id, format.isPro)}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-all",
                  selectedFormat === format.id
                    ? "border-brand-turquoise bg-brand-turquoise/10 text-brand-turquoise shadow-sm"
                    : "border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50",
                )}
              >
                {format.id}
                {format.isPro && <Lock className="h-3.5 w-3.5 text-brand-mustard" />}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Marca de agua (Premium)</h3>
          {plan === "PRO" ? (
            <div className="flex items-center gap-4">
              <input id="watermark-upload" type="file" accept="image/png" className="hidden" onChange={handleWatermarkChange} />
              <label htmlFor="watermark-upload" className="flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-brand-turquoise px-4 py-2.5 text-sm font-bold text-brand-turquoise hover:bg-brand-turquoise/5">
                <Upload size={16} />
                {watermarkFile ? watermarkFile.name : "Subir marca de agua (PNG)"}
              </label>
              {watermarkFile && <button onClick={() => setWatermarkFile(null)} className="text-slate-400 hover:text-red-500"><X size={18} /></button>}
            </div>
          ) : (
            <div className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs font-medium text-slate-500">
              <AlertCircle size={16} className="shrink-0 text-brand-mustard" />
              <span>Actualiza a Premium para subir tu propia marca de agua.</span>
            </div>
          )}
        </div>

        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={isConverting || files.length === 0}
          className="group flex w-full items-center justify-center gap-3 rounded-[1.5rem] bg-slate-900 py-5 font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isConverting ? <Loader2 className="h-6 w-6 animate-spin" /> : <Download className="h-6 w-6" />}
          {isConverting ? "Convirtiendo..." : "Convertir imagen"}
        </button>
      </GlassCard>

      <ProUpgradeModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} message={modalMessage} />
      <DownloadUpsellModal
        isOpen={isUpsellModalOpen}
        onClose={() => setIsUpsellModalOpen(false)}
        title="¡Imágenes convertidas! 🚀"
        subtitle="Desbloquea conversiones masivas y formatos WEBP/TIFF pasándote a PRO."
      />
    </div>
  );
}
