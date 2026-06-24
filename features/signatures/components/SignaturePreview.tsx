import React, { forwardRef } from 'react';
import { FileText, Smartphone } from 'lucide-react';

export interface IdentityData {
  nombre: string;
  cargo: string;
  empresa: string;
  descripcion: string;
  email: string;
  telefono: string;
  sitioWeb: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  twitch?: string;
  discord?: string;
  reddit?: string;
  behance?: string;
  dribbble?: string;
  gitlab?: string;
  medium?: string;
  devto?: string;
  stackoverflow?: string;
}

interface SignaturePreviewProps {
  data: IdentityData;
  plan: 'FREE' | 'PRO';
  templateId: string;
}

export const SignaturePreview = forwardRef<HTMLDivElement, SignaturePreviewProps>(
  ({ data, plan, templateId }, ref) => {
    return (
      <div ref={ref} className="w-full flex flex-col items-center justify-center p-8 space-y-6 text-center">
        <div className="bg-brand-turquoise/10 p-6 rounded-full">
          <FileText className="w-16 h-16 text-brand-turquoise" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Generador de Identidad Digital</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            Completa tus datos en el formulario para generar tu CV interactivo en PDF o tu tarjeta de contacto (vCard) descargable al instante.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-400 mt-4">
          <div className="flex items-center gap-1.5"><FileText size={14} /> PDF</div>
          <span>•</span>
          <div className="flex items-center gap-1.5"><Smartphone size={14} /> vCard</div>
        </div>
      </div>
    );
  }
);

SignaturePreview.displayName = 'SignaturePreview';
