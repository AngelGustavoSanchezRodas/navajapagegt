"use client";

import React, { useState, useRef } from "react";
import { Copy, Lock, ChevronDown, Check, Sparkles, User, Building2, Phone, Share2, Save, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/shared/contexts/AuthContext";
import { ProUpgradeModal } from "@/shared/components/ui/ProUpgradeModal";
import { GlassCard } from "@/shared/components/ui/GlassCard";
import { cn } from "@/shared/lib/utils";
import { apiFetch } from "@/shared/lib/api";
import { SignaturePreview, SignatureData } from "./SignaturePreview";
import { useLocalStorage } from "@/shared/hooks/useLocalStorage";

const TEMPLATES = [
  { id: 'minimal', name: 'Minimalista', isPro: false },
  { id: 'modern', name: 'Moderno', isPro: false },
  { id: 'corporate', name: 'Corporativo', isPro: true },
  { id: 'creative', name: 'Creativo', isPro: true },
];

export function SignatureBuilder() {
  const { plan } = useAuth();
  const [activeAccordion, setActiveAccordion] = useState<string>('personal');
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [templateId, setTemplateId] = useState('minimal');
  const [isSaving, setIsSaving] = useState(false);
  
  const [data, setData, removeData] = useLocalStorage<SignatureData>('signatureData', {
    nombre: '',
    cargo: '',
    empresa: '',
    email: '',
    telefono: '',
    sitioWeb: '',
    photoUrl: '',
    linkedin: '',
    twitter: '',
    github: '',
    tiktok: '',
    youtube: '',
    twitch: '',
    discord: '',
    reddit: '',
    behance: '',
    dribbble: '',
    gitlab: '',
    medium: '',
    devto: '',
    stackoverflow: '',
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const handleClearDraft = () => {
    removeData();
    toast.success("Borrador de firma limpiado correctamente");
  };

  const handleTemplateSelect = (id: string, isPro: boolean) => {
    if (isPro && plan === 'FREE') {
      setIsProModalOpen(true);
      return;
    }
    setTemplateId(id);
  };

  const handleInputChange = (field: keyof SignatureData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleCopySignature = async () => {
    if (!previewRef.current) return;
    
    // Extracción limpia del HTML renderizado
    const htmlContent = previewRef.current.innerHTML;
    
    try {
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      await navigator.clipboard.write([clipboardItem]);
      toast.success("¡Firma copiada! Pégala en Gmail o Outlook.");
    } catch (error) {
      console.error("Error al copiar:", error);
      toast.error("Error al copiar la firma.");
    }
  };

  const handleSaveSignature = async () => {
    setIsSaving(true);
    try {
      const payload = {
        urlOriginal: "https://navaja.gt/signature-preview",
        tipo: "SIGNATURE",
        metadata: {
          ...data,
          templateId
        }
      };

      await apiFetch('/api/core/links/create', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      toast.success("¡Firma guardada correctamente!");
    } catch (error: any) {
      if (error.status === 402 || error.status === 403) {
        setIsProModalOpen(true);
        toast.error(error.message || 'La plantilla seleccionada es exclusiva del plan PRO.');
        return;
      }
      console.error("Error al guardar:", error);
      toast.error("Error al guardar la firma en tu cuenta.");
    } finally {
      setIsSaving(false);
    }
  };

  const AccordionHeader = ({ id, title, icon: Icon }: { id: string, title: string, icon: any }) => (
    <button 
      onClick={() => setActiveAccordion(activeAccordion === id ? '' : id)}
      className="flex items-center justify-between w-full p-5 bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-xl transition-colors",
          activeAccordion === id ? "bg-brand-turquoise/10 text-brand-turquoise" : "bg-slate-100 text-slate-500"
        )}>
          <Icon size={18} />
        </div>
        <span className="font-bold text-slate-900">{title}</span>
      </div>
      <ChevronDown 
        size={20} 
        className={cn("text-slate-400 transition-transform duration-300", activeAccordion === id ? "rotate-180" : "")} 
      />
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* LEFT COLUMN: Scrollable Form */}
      <div className="w-full lg:w-1/2 space-y-6">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-lg font-bold text-slate-800">Diseño de Firma</h2>
          <button
            onClick={handleClearDraft}
            className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5 bg-slate-100/50 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline-block">Limpiar Borrador</span>
          </button>
        </div>
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Datos Personales */}
          <div>
            <AccordionHeader id="personal" title="Datos Personales" icon={User} />
            <AnimatePresence>
              {activeAccordion === 'personal' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-slate-50/50"
                >
                  <div className="p-5 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre Completo</label>
                      <input 
                        type="text" 
                        value={data.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">URL de Foto (Avatar)</label>
                      <input 
                        type="text" 
                        value={data.photoUrl}
                        onChange={(e) => handleInputChange('photoUrl', e.target.value)}
                        placeholder="https://ejemplo.com/mifoto.jpg"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/20 transition-all"
                      />
                      <p className="text-[10px] text-slate-400 font-medium px-1">Usa enlaces directos (.jpg, .png)</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Empresa */}
          <div>
            <AccordionHeader id="company" title="Empresa" icon={Building2} />
            <AnimatePresence>
              {activeAccordion === 'company' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-slate-50/50"
                >
                  <div className="p-5 space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cargo / Puesto</label>
                      <input 
                        type="text" 
                        value={data.cargo}
                        onChange={(e) => handleInputChange('cargo', e.target.value)}
                        placeholder="Ej. Director de Marketing"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre de la Empresa</label>
                      <input 
                        type="text" 
                        value={data.empresa}
                        onChange={(e) => handleInputChange('empresa', e.target.value)}
                        placeholder="Ej. NavajaGT S.A."
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/20 transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contacto */}
          <div>
            <AccordionHeader id="contact" title="Contacto" icon={Phone} />
            <AnimatePresence>
              {activeAccordion === 'contact' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-slate-50/50"
                >
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teléfono</label>
                        <input 
                          type="text" 
                          value={data.telefono}
                          onChange={(e) => handleInputChange('telefono', e.target.value)}
                          placeholder="+502 1234-5678"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/20 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Correo</label>
                        <input 
                          type="email" 
                          value={data.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="hola@ejemplo.com"
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/20 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sitio Web</label>
                      <input 
                        type="url" 
                        value={data.sitioWeb}
                        onChange={(e) => handleInputChange('sitioWeb', e.target.value)}
                        placeholder="https://navaja.gt"
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/20 transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Redes Sociales */}
          <div>
            <AccordionHeader id="social" title="Redes Sociales" icon={Share2} />
            <AnimatePresence>
              {activeAccordion === 'social' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-slate-50/50"
                >
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {['github', 'linkedin', 'twitter', 'tiktok', 'youtube', 'twitch', 'discord', 'reddit', 'behance', 'dribbble', 'gitlab', 'medium', 'devto', 'stackoverflow'].map((platform) => (
                        <div key={platform} className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{platform}</label>
                          <input 
                            type="url" 
                            value={data[platform as keyof SignatureData] || ''}
                            onChange={(e) => handleInputChange(platform as keyof SignatureData, e.target.value)}
                            placeholder={`https://${platform}.com/...`}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-brand-turquoise focus:ring-2 focus:ring-brand-turquoise/20 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Sticky Preview & Templates */}
      <div className="w-full lg:w-1/2 lg:sticky lg:top-24 space-y-6">
        
        {/* Templates Carousel */}
        <div className="bg-white p-4 md:p-5 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Plantillas</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => handleTemplateSelect(t.id, t.isPro)}
                className={cn(
                  "relative flex-shrink-0 px-5 py-3 rounded-xl border-2 text-sm font-bold transition-all",
                  templateId === t.id 
                    ? "border-brand-turquoise bg-brand-turquoise/10 text-brand-turquoise ring-2 ring-blue-500 ring-offset-2" 
                    : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                )}
              >
                <div className="flex items-center gap-2">
                  {t.name}
                  {t.isPro && (
                    <Lock size={14} className={templateId === t.id ? "text-brand-turquoise" : "text-brand-mustard"} />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <GlassCard className="p-4 md:p-8 border-slate-200 flex items-center justify-center min-h-[300px] overflow-x-auto w-full max-w-full">
          {/* Aquí inyectamos el HTML Engine */}
          <SignaturePreview 
            ref={previewRef}
            data={data}
            plan={plan}
            templateId={templateId}
          />
        </GlassCard>

        <div className="flex gap-4">
          <button 
            onClick={handleCopySignature}
            className="group flex-1 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]"
          >
            <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline-block">Copiar</span>
          </button>
          
          <button 
            onClick={handleSaveSignature}
            disabled={isSaving}
            className="group flex-1 py-4 bg-brand-turquoise text-slate-900 rounded-[1.5rem] font-black uppercase tracking-[0.1em] flex items-center justify-center gap-2 hover:bg-brand-turquoise/90 transition-all shadow-xl shadow-brand-turquoise/20 active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />}
            Guardar
          </button>
        </div>
      </div>

      <ProUpgradeModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
        message="Las plantillas Corporativa y Creativa son exclusivas de nuestros planes Premium. Actualiza para impresionar a tus clientes."
      />
    </div>
  );
}
