"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UrlShortenerTool } from "@/features/links/components/UrlShortenerTool";
import { BackgroundGlow } from "@/shared/components/ui/BackgroundGlow";
import Link from "next/link";

import { ImageConverterTool } from "@/features/tools/components/ImageConverterTool";
import { ContactQrTool } from '@/features/tools/components/ContactQrTool';

export default function ToolPage() {
  const params = useParams();
  const toolId = params.toolId as string;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, [toolId]);

  const renderTool = () => {
    switch (toolId) {
      case "acortador":
        return <UrlShortenerTool />;
      case "convertidor":
        return <ImageConverterTool />;
      case "qr":
        return <ContactQrTool />;
      default:
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-900">Herramienta no encontrada</h2>
            <Link href="/" className="mt-4 inline-block text-brand-turquoise font-bold hover:underline">
              Volver al inicio
            </Link>
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (toolId) {
      case "acortador": return "Acortador de Enlaces";
      case "convertidor": return "Convertidor de Imágenes";
      case "qr": return "Generador QR Pro";
      default: return "Herramienta";
    }
  };

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative min-h-screen">
      <BackgroundGlow color="turquoise" className="left-[-10%] top-[-5%] h-[40rem] w-[40rem] opacity-20" />
      
      <div className="relative z-10 w-full">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            {getTitle()}
          </h1>
          <p className="mt-4 text-lg font-medium text-slate-500">
            Potente, rápido y profesional. Todo lo que necesitas en una sola herramienta.
          </p>
        </header>

        <div className="w-full">
          {isMounted && renderTool()}
        </div>
      </div>
    </main>
  );
}
