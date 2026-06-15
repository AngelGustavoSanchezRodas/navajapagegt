"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Download, Loader2, AlertCircle, Lock, Image as ImageIcon } from "lucide-react";
import { GlassCard } from "@/shared/components/ui/GlassCard";
import { cn } from "@/shared/lib/utils";
import { apiFetch } from "@/shared/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/shared/contexts/AuthContext";
import { ProUpgradeModal } from "@/shared/components/ui/ProUpgradeModal";
import { DownloadUpsellModal } from "@/shared/components/ui/DownloadUpsellModal";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const FORMATOS = [
  { id: 'JPG', isPro: false },
  { id: 'PNG', isPro: false },
  { id: 'WEBP', isPro: true },
  { id: 'BMP', isPro: true },
  { id: 'GIF', isPro: true },
  { id: 'TIFF', isPro: true },
];

export function ImageConverterTool() {
  const { plan } = useAuth();
  const [selectedFormat, setSelectedFormat] = useState('JPG');
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [watermarkFile, setWatermarkFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Limpieza de URLs
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleFormatSelect = (formatId: string, isPro: boolean) => {
    if (isPro && plan === 'FREE') {
      setModalMessage(`El formato ${formatId} es exclusivo para usuarios Premium.`);
      setIsProModalOpen(true);
      return;
    }
    setSelectedFormat(formatId);
  };

  const processFiles = (selectedFiles: File[]) => {
    if (selectedFiles.length === 0) return;

    // Validación de plan para múltiples archivos
    if (selectedFiles.length > 1 && plan === 'FREE') {
      setModalMessage("La conversión por lotes es una función Premium. Actualiza para convertir múltiples imágenes a la vez.");
      setIsProModalOpen(true);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validación de tamaño
    const validFiles = selectedFiles.filter(file => file.size <= MAX_FILE_SIZE && file.type.startsWith("image/"));
    
    if (validFiles.length !== selectedFiles.length) {
      toast.error("Algunos archivos fueron ignorados por exceder 5MB o no ser imágenes válidas.");
    }

    if (validFiles.length > 0) {
      // Limpiar previas anteriores
      previews.forEach(url => URL.revokeObjectURL(url));
      
      setFiles(validFiles);
      setPreviews(validFiles.map(file => URL.createObjectURL(file)));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const newPreviews = [...previews];
    
    URL.revokeObjectURL(newPreviews[index]);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsConverting(true);

    try {
      const conversionPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', selectedFormat);
        if (watermarkFile && plan === 'PRO') {
          formData.append('watermark', watermarkFile);
        }

        // Usamos apiFetch para mantener la consistencia con el token y el endpoint
        const blob = await apiFetch<Blob>('/api/v1/tools/convert-image', {
          method: "POST",
          body: formData,
          responseType: 'blob'
        });

        return { name: file.name, blob };
      });

      const convertedFiles = await Promise.all(conversionPromises);

      // Proceso de descarga
      convertedFiles.forEach((fileInfo) => {
        const url = URL.createObjectURL(fileInfo.blob);
        const link = document.createElement('a');
        link.href = url;
        const newName = fileInfo.name.replace(/\.[^/.]+$/, "") + `.${selectedFormat.toLowerCase()}`;
        link.download = newName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Retrasamos la limpieza para asegurar que el navegador inicie la descarga
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });

      // Upsell Post-Descarga (Hook de Conversión PLG)
      if (plan === 'FREE') {
        setTimeout(() => {
          setIsUpsellModalOpen(true);
        }, 1500);
      } else {
        toast.success(`¡${files.length} archivo(s) convertido(s) con éxito!`);
      }

    } catch (error) {
      console.error(error);
      toast.error('Ocurrió un error en la conversión de algunos archivos.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <GlassCard className="p-5 sm:p-8 lg:p-10 space-y-8">
        
        {/* Dynamic Area: Dropzone or Large Preview */}
        {files.length === 0 ? (
          <div 
            className={cn(
              "relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300",
              isDragging ? "border-brand-turquoise bg-brand-turquoise/5 scale-[1.02]" : "border-slate-200 bg-slate-50/50 hover:border-brand-turquoise/50"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <input 
              type="file" 
              multiple 
              onChange={handleFileChange}
              className="hidden" 
              id="file-upload" 
              ref={fileInputRef}
              accept="image/*"
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400">
                <ImageIcon className="w-8 h-8" />
              </div>
              <div>
                <span className="text-slate-900 font-bold text-lg block">Arrastra tus imágenes aquí</span>
                <span className="text-sm text-slate-500 font-medium mt-1 block">
                  {plan === 'FREE' ? 'Máx. 1 imagen (Actualiza a PRO para lotes)' : 'Sube múltiples imágenes a la vez'}
                </span>
              </div>
            </label>
          </div>
        ) : (
          <div className="relative w-full rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group transition-all duration-500">
            <div className="aspect-[4/3] sm:aspect-video relative flex items-center justify-center p-4">
              <img 
                src={previews[0]} 
                alt="Preview principal" 
                className="w-full h-full max-h-[60vh] object-contain drop-shadow-sm rounded-xl animate-in fade-in zoom-in-95 duration-500"
              />
              
              {/* Badge Formato Original */}
              <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-lg flex items-center gap-2">
                <ImageIcon size={14} className="text-brand-turquoise" />
                Formato detectado: {files[0].name.split('.').pop()?.toUpperCase() || 'IMG'}
              </div>

              {/* Botón Cerrar/Reset */}
              <button 
                onClick={() => {
                  setFiles([]);
                  setPreviews([]);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 p-2.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:text-red-500 hover:scale-105 active:scale-95"
              >
                <X size={16} />
              </button>

              {/* Indicador de archivos múltiples */}
              {files.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-brand-turquoise text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-brand-turquoise/20 flex items-center gap-2 animate-in slide-in-from-bottom-2">
                  <div className="flex -space-x-2">
                    {previews.slice(1, 4).map((url, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-brand-turquoise overflow-hidden bg-white">
                        <img src={url} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <span>+ {files.length - 1} imágenes</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Format Selector */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Formato de Salida</h3>
          <div className="flex flex-wrap gap-2">
            {FORMATOS.map((f) => (
              <button
                key={f.id}
                onClick={() => handleFormatSelect(f.id, f.isPro)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border-2",
                  selectedFormat === f.id 
                    ? "bg-brand-turquoise/10 border-brand-turquoise text-brand-turquoise shadow-sm" 
                    : "bg-white border-slate-100 text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                )}
              >
                {f.id}
                {f.isPro && (
                  <Lock className={cn(
                    "w-3.5 h-3.5",
                    selectedFormat === f.id ? "text-brand-turquoise" : "text-brand-mustard"
                  )} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Marca de Agua */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Marca de Agua (Premium)</h3>
          {plan === 'PRO' ? (
            <div className="flex items-center gap-4">
              <input
                type="file"
                id="watermark-upload"
                accept="image/png"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setWatermarkFile(f);
                }}
              />
              <label 
                htmlFor="watermark-upload"
                className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-brand-turquoise text-sm font-bold text-brand-turquoise hover:bg-brand-turquoise/5 transition-colors"
              >
                <Upload size={16} />
                {watermarkFile ? watermarkFile.name : 'Subir Marca de Agua (PNG)'}
              </label>
              {watermarkFile && (
                <button 
                  onClick={() => setWatermarkFile(null)}
                  className="text-slate-400 hover:text-red-500"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-500 flex items-start gap-2">
              <AlertCircle size={16} className="text-brand-mustard shrink-0" />
              <span>Actualiza a Premium para subir tu propia marca de agua. Las imágenes de usuarios gratuitos incluirán una marca de agua predeterminada de la plataforma.</span>
            </div>
          )}
        </div>

        {/* Convert Button */}
        <button 
          onClick={handleConvert}
          disabled={isConverting || files.length === 0}
          className="group w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConverting ? <Loader2 className="animate-spin w-6 h-6" /> : <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />}
          {isConverting ? 'Convirtiendo...' : 'Convertir Imagen'}
        </button>
      </GlassCard>

      <ProUpgradeModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
        message={modalMessage} 
      />

      <DownloadUpsellModal 
        isOpen={isUpsellModalOpen}
        onClose={() => setIsUpsellModalOpen(false)}
        title="¡Imágenes convertidas! 🚀"
        subtitle="Desbloquea conversiones masivas y formatos WEBP/TIFF pasándote a PRO."
      />
    </div>
  );
}

