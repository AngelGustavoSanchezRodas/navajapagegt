"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string, message: string = "¡Enlace copiado al portapapeles!") => {
    if (!navigator.clipboard) {
      toast.error("Tu navegador no soporta el portapapeles");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(message);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      return true;
    } catch (error) {
      console.error("Error al copiar:", error);
      toast.error("No se pudo copiar el enlace");
      return false;
    }
  };

  return { copy, copied };
}
