import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { useAuth } from '@/shared/contexts/AuthContext';

export type QrType = 'LINK' | 'WHATSAPP' | 'TELEFONO' | 'EMAIL';

export function useContactQr() {
  const { plan } = useAuth();
  const [type, setType] = useState<QrType>('LINK');
  const [formData, setFormData] = useState({
    url: '',
    whatsappPhone: '',
    whatsappMessage: '',
    tel: '',
    emailAddress: '',
    emailSubject: ''
  });
  
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState('squares');
  const [logo, setLogo] = useState<File | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);

  const tipoMapa: Record<string, string> = {
    'LINK': 'URL',
    'TELEFONO': 'PHONE',
    'WHATSAPP': 'WHATSAPP',
    'EMAIL': 'EMAIL'
  };

  const formatHex = (hex: string) => {
    if (!hex.startsWith('#')) hex = '#' + hex;
    if (hex.length === 4) {
      return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    return hex.padEnd(7, '0').slice(0, 7);
  };

  useEffect(() => {
    return () => {
      if (qrUrl) URL.revokeObjectURL(qrUrl);
    };
  }, [qrUrl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (plan === 'FREE') {
        setIsProModalOpen(true);
        return;
      }
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLogoBase64(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateQr = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (qrUrl) {
      URL.revokeObjectURL(qrUrl);
      setQrUrl(null);
    }

    try {
      const tipoBackend = tipoMapa[type] || 'URL';
      let payloadData: Record<string, string> = {};
      
      switch (type) {
        case 'LINK':
          let sanitizedUrl = formData.url.trim();
          if (!/^https?:\/\//i.test(sanitizedUrl)) {
            sanitizedUrl = `https://${sanitizedUrl}`;
          }
          payloadData = { url: sanitizedUrl };
          break;
        case 'TELEFONO':
          payloadData = { numero: formData.tel };
          break;
        case 'WHATSAPP':
          payloadData = { 
            numero: formData.whatsappPhone, 
            mensaje: formData.whatsappMessage || '' 
          };
          break;
        case 'EMAIL':
          payloadData = { 
            correo: formData.emailAddress, 
            asunto: formData.emailSubject || '' 
          };
          break;
      }

      const requestBody = {
        tipo: tipoBackend,
        payload: payloadData,
        colorFondo: formatHex(backgroundColor),
        colorFrente: formatHex(foregroundColor),
        logoBase64: logoBase64
      };

      const response = await fetch(`/api/v1/tools/qr/generate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('token') || ''}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        if (response.status === 402 || response.status === 403) {
          setIsProModalOpen(true);
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const blob = await response.blob();
      setQrUrl(URL.createObjectURL(blob));
      toast.success("¡Código QR generado con éxito!");
    } catch (error: any) {
      toast.error(error.message || "Error al generar el código QR");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrUrl) return;
    
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `NavajaGT_QR_${type}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsUpsellModalOpen(true);
    }, 500);
  };

  return {
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
  };
}
