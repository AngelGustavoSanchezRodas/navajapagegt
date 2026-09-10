"use client";

import React from 'react';
import { GlassCard } from '@/shared/components/ui/GlassCard';
import { 
  QrCode, 
  Link as LinkIcon, 
  Phone, 
  Mail, 
  ArrowRight, 
  Loader2, 
  Download, 
  MessageSquare,
  Palette,
  CheckCircle2,
  Upload,
  Lock,
  Grid3X3,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { ProUpgradeModal } from '@/shared/components/ui/ProUpgradeModal';
import { DownloadUpsellModal } from '@/shared/components/ui/DownloadUpsellModal';
import { useContactQr } from '../hooks/useContactQr';

export const ContactQrTool: React.FC = () => {
  const {
    plan,
    type,
    setType,
    formData,
    setFormData,
    foregroundColor,
    setForegroundColor,
    backgroundColor,
    setBackgroundColor,
    qrUrl,
    setQrUrl,
    loading,
    isProModalOpen,
    setIsProModalOpen,
    isUpsellModalOpen,
    setIsUpsellModalOpen,
    selectedPattern,
    setSelectedPattern,
    logo,
    setLogo,
    handleLogoUpload,
    handleGenerateQr,
    handleDownload
  } = useContactQr();

  const PRESET_COLORS = [
    '#000000', '#00E5FF', '#FF0055', '#FFD500', 
    '#6366F1', '#10B981', '#F59E0B', '#EF4444'
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Columna Izquierda: Formulario */}
      <GlassCard className="flex-1 p-4 md:p-8 lg:p-10 rounded-[2.5rem] border-white/60 shadow-xl overflow-hidden relative">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-turquoise/5 blur-3xl" aria-hidden="true" />
        
        <div className="relative z-10 flex items-center gap-4 mb-8">
          <div className="p-3 bg-brand-turquoise/10 text-brand-turquoise rounded-2xl shadow-inner" aria-hidden="true">
            <QrCode className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Generador QR Dinámico</h2>
            <p className="text-sm text-slate-500 font-medium">Crea, personaliza y descarga QRs de alta calidad.</p>
          </div>
        </div>

        {/* Tabs */}
        <div 
          className="relative z-10 flex p-1.5 bg-slate-100 rounded-[1.5rem] mb-10 overflow-x-auto no-scrollbar"
          role="tablist"
          aria-label="Tipo de Código QR"
        >
          {(['LINK', 'WHATSAPP', 'TELEFONO', 'EMAIL'] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={type === t}
              aria-controls={`panel-${t}`}
              id={`tab-${t}`}
              type="button"
              onClick={() => { setType(t); setQrUrl(null); }}
              className={cn(
                "flex-1 min-w-[100px] py-3.5 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                type === t 
                  ? "bg-white text-brand-turquoise shadow-md scale-[1.02]" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              )}
            >
              {t === 'TELEFONO' ? 'TELÉFONO' : t}
            </button>
          ))}
        </div>

        <form onSubmit={handleGenerateQr} className="relative z-10 flex flex-col gap-8 sm:gap-10">
          {/* Dynamic Form Fields */}
          <div className="flex flex-col gap-4 sm:gap-6" role="tabpanel" id={`panel-${type}`} aria-labelledby={`tab-${type}`}>
            {type === 'LINK' && (
              <div className="space-y-3 animate-in slide-in-from-left-2 duration-300">
                <label htmlFor="url-input" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Dirección URL Destino</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-turquoise transition-colors" aria-hidden="true"><LinkIcon size={20} /></div>
                  <input 
                    id="url-input"
                    type="url" 
                    required 
                    maxLength={2048}
                    value={formData.url} 
                    onChange={(e) => setFormData({...formData, url: e.target.value})} 
                    placeholder="https://tu-sitio.com" 
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-turquoise/20 focus:bg-white rounded-[1.5rem] outline-none transition-all text-slate-900 font-bold text-lg shadow-sm" 
                  />
                </div>
              </div>
            )}

            {type === 'WHATSAPP' && (
              <div className="flex flex-col gap-4 sm:gap-6 animate-in slide-in-from-left-2 duration-300">
                <div className="flex flex-col gap-3">
                  <label htmlFor="whatsapp-input" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Número de WhatsApp (con código)</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-turquoise transition-colors" aria-hidden="true"><Phone size={20} /></div>
                    <input 
                      id="whatsapp-input"
                      type="tel" 
                      required 
                      pattern="[\+]?[0-9]{8,15}"
                      title="Ingresa un número válido con código de país, ej: +34600000000"
                      value={formData.whatsappPhone} 
                      onChange={(e) => setFormData({...formData, whatsappPhone: e.target.value})} 
                      placeholder="+34 600 000 000" 
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-turquoise/20 focus:bg-white rounded-[1.5rem] outline-none transition-all text-slate-900 font-bold text-lg shadow-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label htmlFor="whatsapp-msg" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Mensaje Predeterminado</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-6 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-turquoise transition-colors" aria-hidden="true"><MessageSquare size={20} /></div>
                    <textarea 
                      id="whatsapp-msg"
                      rows={4} 
                      maxLength={500}
                      value={formData.whatsappMessage} 
                      onChange={(e) => setFormData({...formData, whatsappMessage: e.target.value})} 
                      placeholder="Hola, me gustaría más información..." 
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-turquoise/20 focus:bg-white rounded-[1.5rem] outline-none transition-all text-slate-900 font-bold text-base shadow-sm resize-none" 
                    />
                  </div>
                </div>
              </div>
            )}

            {type === 'EMAIL' && (
              <div className="flex flex-col gap-4 sm:gap-6 animate-in slide-in-from-left-2 duration-300">
                <div className="flex flex-col gap-3">
                  <label htmlFor="email-input" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Correo Electrónico Destino</label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-turquoise transition-colors" aria-hidden="true"><Mail size={20} /></div>
                    <input 
                      id="email-input"
                      type="email" 
                      required 
                      maxLength={254}
                      value={formData.emailAddress} 
                      onChange={(e) => setFormData({...formData, emailAddress: e.target.value})} 
                      placeholder="hola@empresa.com" 
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-turquoise/20 focus:bg-white rounded-[1.5rem] outline-none transition-all text-slate-900 font-bold text-lg shadow-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label htmlFor="email-subject" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Asunto del Correo</label>
                  <input 
                    id="email-subject"
                    type="text" 
                    maxLength={100}
                    value={formData.emailSubject} 
                    onChange={(e) => setFormData({...formData, emailSubject: e.target.value})} 
                    placeholder="Consulta desde NavajaGT" 
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-turquoise/20 focus:bg-white rounded-[1.5rem] outline-none transition-all text-slate-900 font-bold text-lg shadow-sm" 
                  />
                </div>
              </div>
            )}

            {type === 'TELEFONO' && (
              <div className="space-y-3 animate-in slide-in-from-left-2 duration-300">
                <label htmlFor="tel-input" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Número de Teléfono</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-turquoise transition-colors" aria-hidden="true"><Phone size={20} /></div>
                  <input 
                    id="tel-input"
                    type="tel" 
                    required 
                    pattern="[\+]?[0-9]{8,15}"
                    title="Ingresa un número válido con código de país"
                    value={formData.tel} 
                    onChange={(e) => setFormData({...formData, tel: e.target.value})} 
                    placeholder="+34 600 000 000" 
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-turquoise/20 focus:bg-white rounded-[1.5rem] outline-none transition-all text-slate-900 font-bold text-lg shadow-sm" 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pro Personalization */}
          <div className="pt-8 border-t border-slate-100 space-y-8" role="group" aria-labelledby="customization-heading">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="text-brand-turquoise" size={20} aria-hidden="true" />
                <h4 id="customization-heading" className="text-sm font-black uppercase tracking-wider text-slate-900">Personalización Pro</h4>
              </div>
            </div>
            
            <div className="relative group rounded-3xl overflow-hidden p-1">
              {plan === 'FREE' && (
                <div 
                  className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-2xl"
                  aria-hidden="true"
                >
                  <button
                    type="button"
                    aria-label="Desbloquear Colores PRO"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProModalOpen(true);
                    }}
                    className="bg-brand-turquoise text-slate-900 px-5 py-3 rounded-2xl font-black uppercase tracking-wider text-xs flex items-center gap-2 hover:scale-[1.03] active:scale-[0.97] transition-all shadow-xl shadow-brand-turquoise/20 border-none"
                  >
                    <Lock size={14} />
                    Desbloquear Colores PRO
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Color Selection */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label id="fg-color-label" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Colores del QR</label>
                    <div 
                      className="flex flex-wrap gap-2" 
                      role="radiogroup" 
                      aria-labelledby="fg-color-label"
                    >
                      {PRESET_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          role="radio"
                          aria-checked={foregroundColor === color}
                          aria-label={`Seleccionar color ${color}`}
                          onClick={() => setForegroundColor(color)}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all",
                            foregroundColor === color ? "border-brand-turquoise scale-110 shadow-lg" : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <div className="relative w-8 h-8 rounded-full border-2 border-slate-200 overflow-hidden" title="Elegir color personalizado">
                        <input 
                          type="color" 
                          aria-label="Elegir color personalizado para el QR"
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className="absolute inset-0 scale-150 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label id="bg-color-label" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Fondo</label>
                    <div 
                      className="flex flex-wrap gap-2"
                      role="radiogroup" 
                      aria-labelledby="bg-color-label"
                    >
                      {['#FFFFFF', '#F8FAFC', '#F1F5F9', '#000000'].map(color => (
                        <button
                          key={color}
                          type="button"
                          role="radio"
                          aria-checked={backgroundColor === color}
                          aria-label={`Seleccionar fondo ${color}`}
                          onClick={() => setBackgroundColor(color)}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all",
                            backgroundColor === color ? "border-brand-turquoise scale-110 shadow-lg" : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pattern Selection */}
                <div className="space-y-3">
                  <label id="pattern-label" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                    <Grid3X3 size={14} aria-hidden="true" /> Patrón de Datos
                  </label>
                  <div 
                    className="grid grid-cols-3 gap-2"
                    role="radiogroup" 
                    aria-labelledby="pattern-label"
                  >
                    {['squares', 'dots', 'rounded'].map(p => (
                      <button
                        key={p}
                        type="button"
                        role="radio"
                        aria-checked={selectedPattern === p}
                        onClick={() => setSelectedPattern(p)}
                        className={cn(
                          "h-12 rounded-xl border-2 flex items-center justify-center transition-all",
                          selectedPattern === p ? "border-brand-turquoise bg-brand-turquoise/5 text-brand-turquoise" : "border-slate-100 text-slate-400 hover:border-slate-200"
                        )}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{p === 'squares' ? 'Cuadros' : p === 'dots' ? 'Puntos' : 'Smooth'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Dropzone */}
            <div className="space-y-3">
              <label id="logo-label" className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <ImageIcon size={14} aria-hidden="true" /> Logotipo al Centro
              </label>
              <div className="relative group">
                <input 
                  type="file" 
                  aria-labelledby="logo-label"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={cn(
                  "w-full py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all",
                  plan === 'FREE' ? "border-slate-100 bg-slate-50/50" : "border-slate-200 group-hover:border-brand-turquoise/50 group-hover:bg-brand-turquoise/5"
                )}>
                  {logo ? (
                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden">
                        <img src={URL.createObjectURL(logo)} alt="Logo preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{logo.name}</span>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <Upload className="w-6 h-6 text-slate-400" aria-hidden="true" />
                        {plan === 'FREE' && (
                          <div className="absolute -top-1 -right-1 bg-brand-mustard text-white p-0.5 rounded-full ring-2 ring-white">
                            <Lock size={8} aria-hidden="true" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Suelta tu imagen o haz clic</p>
                      {plan === 'FREE' && <p className="text-[9px] font-medium text-brand-mustard uppercase tracking-tighter">Función Premium</p>}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={24} aria-hidden="true" /> : "Generar QR"}
            {!loading && <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} aria-hidden="true" />}
          </button>
        </form>
      </GlassCard>

      {/* Columna Derecha: Vista Previa en Tiempo Real */}
      <div className="w-full lg:w-[350px] xl:w-[400px] flex-shrink-0">
        <GlassCard className="p-8 rounded-[2.5rem] border-white/60 shadow-xl h-full flex flex-col items-center justify-center min-h-[400px] lg:min-h-full bg-slate-50/50 relative overflow-hidden">
          {/* Base Card Background representing the selected colors */}
          <div className="absolute inset-0 opacity-20 transition-colors duration-500" style={{ backgroundColor: foregroundColor }} />
          
          <div className="relative z-10 w-full flex flex-col items-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
              <QrCode size={16} /> Vista Previa
            </h3>

            {qrUrl ? (
              <div className="group relative overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl w-full aspect-square animate-in zoom-in-95 duration-500">
                <img src={qrUrl} alt="Código QR Final" className="w-full h-full object-contain bg-white" />
                
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4">
                  <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-brand-turquoise text-white px-6 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:scale-105"
                  >
                    <Download className="w-5 h-5" />
                    Descargar QR
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="w-full aspect-square rounded-[2rem] border-4 border-white shadow-xl flex items-center justify-center transition-colors duration-500 relative overflow-hidden"
                style={{ backgroundColor: backgroundColor }}
              >
                {/* Esqueleto del QR */}
                <div className="absolute inset-8 grid grid-cols-5 gap-2 opacity-10" style={{ color: foregroundColor }}>
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} className="bg-current rounded-sm" style={{ 
                      borderRadius: selectedPattern === 'rounded' ? '50%' : selectedPattern === 'dots' ? '100%' : '4px' 
                    }} />
                  ))}
                </div>
                
                <div className="text-center px-6 relative z-10">
                  <QrCode size={48} className="mx-auto mb-4 opacity-50 transition-colors duration-500" style={{ color: foregroundColor }} />
                  <p className="text-sm font-bold opacity-70 transition-colors duration-500" style={{ color: foregroundColor }}>
                    Completa el formulario para generar tu QR
                  </p>
                </div>
              </div>
            )}
            
            {qrUrl && (
              <p className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 animate-in slide-in-from-bottom-2">
                <CheckCircle2 size={16} /> ¡QR Listo!
              </p>
            )}
          </div>
        </GlassCard>
      </div>

      <ProUpgradeModal 
        isOpen={isProModalOpen} 
        onClose={() => setIsProModalOpen(false)} 
        message="Esta función avanzada requiere una cuenta Premium para ser procesada en el resultado final." 
      />

      <DownloadUpsellModal 
        isOpen={isUpsellModalOpen}
        onClose={() => setIsUpsellModalOpen(false)}
      />
    </div>
  );
};
